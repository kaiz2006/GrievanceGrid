from __future__ import annotations

import logging
import json
from datetime import datetime, timezone
from typing import Any

import redis
from celery import shared_task

from src.config import settings

logger = logging.getLogger(__name__)


def _redis_client() -> redis.Redis:
    return redis.Redis.from_url(settings.redis_pubsub_url, decode_responses=True)


@shared_task(name="src.tasks.notifications.send_status_notification")
def send_status_notification(grievance_id: str, status: str, recipients: list[str]) -> dict[str, Any]:
    """Dispatch push/SMS notification payload for grievance status changes."""
    if settings.dry_run:
        logger.info("WORKER_DRY_RUN enabled, returning simulated notification response")
        delivered = 0
    else:
        # Placeholder delivery accounting until provider adapters are integrated.
        delivered = len(recipients)

    result = {
        "grievance_id": grievance_id,
        "status": status,
        "recipients": recipients,
        "delivered": delivered,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    logger.info("Notification task completed", extra={"result": result})
    return result


@shared_task(name="src.tasks.notifications.publish_tracking_event")
def publish_tracking_event(grievance_id: str, event: dict[str, Any]) -> dict[str, Any]:
    """Publish websocket/pubsub-style tracking update payload."""
    if settings.dry_run:
        logger.info("WORKER_DRY_RUN enabled, returning simulated pub/sub publish")
        published = False
    else:
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
            published = False

    result = {
        "grievance_id": grievance_id,
        "event": event,
        "published": published,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    logger.info("Tracking event published", extra={"result": result})
    return result
