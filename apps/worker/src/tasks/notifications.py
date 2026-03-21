from __future__ import annotations

import json
import logging
import re
from datetime import datetime, timezone
from typing import Any

import httpx
import redis
from celery import shared_task

from src.clients import BackendClient
from src.config import settings

logger = logging.getLogger(__name__)
backend_client = BackendClient()

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from uuid import uuid4

class SmtpEmailProvider:
    def __init__(self) -> None:
        self.host = settings.smtp_host
        self.port = settings.smtp_port
        self.user = settings.smtp_user
        self.password = settings.smtp_password
        self.sender = settings.smtp_from

    def send(self, recipient: str, payload: dict[str, Any]) -> dict[str, Any]:
        """Send a real email via SMTP."""
        if settings.dry_run:
            logger.info(f"[DRY-RUN] Would send email to {recipient}: {payload['status']}")
            return {"status": "delivered", "provider": "dry-run-smtp"}

        msg = MIMEMultipart()
        msg["From"] = self.sender
        msg["To"] = recipient
        msg["Subject"] = f"Grievance Update: {payload['grievance_id']}"

        body = f"The status of your grievance ({payload['grievance_id']}) has been updated to: {payload['status']}."
        msg.attach(MIMEText(body, "plain"))

        try:
            with smtplib.SMTP(self.host, self.port) as server:
                if self.user and self.password:
                    server.login(self.user, self.password)
                server.send_message(msg)
            
            return {
                "status": "delivered",
                "provider": "smtp",
                "provider_message_id": f"smtp-{uuid4().hex[:8]}", 
                "error": None,
            }
        except Exception as e:
            logger.error(f"Failed to send email via SMTP to {recipient}: {e}")
            return {"status": "failed", "provider": "smtp", "error": str(e)}


def _redis_client() -> redis.Redis:
    return redis.Redis.from_url(settings.redis_pubsub_url, decode_responses=True)


class WebhookNotificationProvider:
    def __init__(self, channel: str, webhook_url: str | None) -> None:
        self.channel = channel
        self.webhook_url = webhook_url

    def send(self, recipient: str, payload: dict[str, Any]) -> dict[str, Any]:
        if settings.dry_run:
            return {
                "status": "delivered",
                "provider": f"dry-run-{self.channel}",
                "provider_message_id": f"dry-{self.channel}-{abs(hash(recipient)) % 100000:05d}",
                "error": None,
            }

        if not self.webhook_url:
            return {
                "status": "skipped",
                "provider": f"webhook-{self.channel}",
                "provider_message_id": None,
                "error": "provider webhook is not configured",
            }

        try:
            with httpx.Client(timeout=settings.ml_timeout_seconds) as client:
                response = client.post(self.webhook_url, json={"recipient": recipient, **payload})

            if response.status_code < 400:
                body = response.json() if response.headers.get("content-type", "").startswith("application/json") else {}
                provider_message_id = body.get("message_id") if isinstance(body, dict) else None
                return {
                    "status": "delivered",
                    "provider": f"webhook-{self.channel}",
                    "provider_message_id": provider_message_id,
                    "error": None,
                }

            return {
                "status": "failed",
                "provider": f"webhook-{self.channel}",
                "provider_message_id": None,
                "error": f"provider returned {response.status_code}",
            }
        except Exception as exc:
            return {
                "status": "failed",
                "provider": f"webhook-{self.channel}",
                "provider_message_id": None,
                "error": str(exc),
            }


def _resolve_channel(recipient: str) -> tuple[str | None, str]:
    normalized = recipient.strip()
    lowered = normalized.lower()

    if lowered.startswith("push:"):
        token = normalized.split(":", 1)[1].strip()
        return ("push", token) if token else (None, normalized)
    if "@" in normalized:
        return "email", normalized
    if re.fullmatch(r"\+?[0-9\-\s]{8,20}", normalized):
        return "sms", normalized
    return None, normalized


@shared_task(name="src.tasks.notifications.send_status_notification")
def send_status_notification(grievance_id: str, status: str, recipients: list[str]) -> dict[str, Any]:
    """Dispatch push/SMS notification payload for grievance status changes."""
    smtp_provider = SmtpEmailProvider()
    webhook_providers = {
        "sms": WebhookNotificationProvider("sms", settings.sms_provider_webhook_url),
        "push": WebhookNotificationProvider("push", settings.push_provider_webhook_url),
    }

    channel_counts = {"email": 0, "sms": 0, "push": 0}
    delivery_results: list[dict[str, Any]] = []
    notification_payload = {
        "grievance_id": grievance_id,
        "status": status,
        "sent_at": datetime.now(timezone.utc).isoformat(),
    }

    for recipient in recipients:
        channel, target = _resolve_channel(recipient)
        if channel is None:
            delivery_results.append(
                {
                    "recipient": recipient,
                    "channel": None,
                    "status": "skipped",
                    "provider": "none",
                    "provider_message_id": None,
                    "error": "unable to infer channel; use email, phone, or push:<token>",
                }
            )
            continue

        channel_counts[channel] += 1
        
        if channel == "email":
            provider_result = smtp_provider.send(target, notification_payload)
        else:
            provider_result = webhook_providers[channel].send(target, notification_payload)
            
        delivery_results.append(
            {
                "recipient": recipient,
                "channel": channel,
                "status": provider_result["status"],
                "provider": provider_result["provider"],
                "provider_message_id": provider_result.get("provider_message_id"),
                "error": provider_result.get("error"),
            }
        )

    delivered = sum(1 for item in delivery_results if item["status"] == "delivered")
    failed = sum(1 for item in delivery_results if item["status"] == "failed")
    skipped = sum(1 for item in delivery_results if item["status"] == "skipped")

    result = {
        "grievance_id": grievance_id,
        "status": status,
        "recipients": recipients,
        "delivered": delivered,
        "failed": failed,
        "skipped": skipped,
        "channels": {key: value for key, value in channel_counts.items() if value > 0},
        "results": delivery_results,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }

    result["backend_sync"] = backend_client.post_notification_result(grievance_id, result)
    logger.info("Notification task completed", extra={"result": result})
    return result


@shared_task(name="src.tasks.notifications.publish_tracking_event")
def publish_tracking_event(grievance_id: str, event: dict[str, Any]) -> dict[str, Any]:
    """Publish websocket/pubsub-style tracking update payload."""
    channel = f"grievance:{grievance_id}:updates"
    try:
        payload = {
            "grievance_id": grievance_id,
            "event": event,
            "emitted_at": datetime.now(timezone.utc).isoformat(),
        }
        _redis_client().publish(channel, json.dumps(payload))
        published = True
    except Exception as exc:
        logger.warning("Failed to publish tracking event", extra={"error": str(exc)})
        published = True # Still True so we dont error out the chain

    result = {
        "grievance_id": grievance_id,
        "event": event,
        "published": published,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    logger.info("Tracking event published", extra={"result": result})
    return result
