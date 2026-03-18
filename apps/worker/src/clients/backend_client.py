from __future__ import annotations

import logging
from typing import Any

import httpx

from src.config import settings

logger = logging.getLogger(__name__)


class BackendClient:
    def __init__(self) -> None:
        self.base_url = settings.api_base_url.rstrip("/")
        self.timeout = settings.ml_timeout_seconds

    def post_ai_result(self, grievance_id: str, result: dict[str, Any]) -> bool:
        url = f"{self.base_url}/api/v1/grievances/{grievance_id}/ai-result"
        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.post(url, json=result)

            if response.status_code in (200, 201, 202, 204):
                return True

            logger.info(
                "AI result callback endpoint unavailable or not yet implemented",
                extra={"url": url, "status_code": response.status_code},
            )
            return False
        except Exception as exc:
            logger.info("AI result callback failed", extra={"url": url, "error": str(exc)})
            return False

    def post_voice_result(self, grievance_id: str, result: dict[str, Any]) -> bool:
        url = f"{self.base_url}/api/v1/voice/{grievance_id}/result"
        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.post(url, json=result)

            if response.status_code in (200, 201, 202, 204):
                return True

            logger.info(
                "Voice result callback endpoint unavailable or not yet implemented",
                extra={"url": url, "status_code": response.status_code},
            )
            return False
        except Exception as exc:
            logger.info("Voice result callback failed", extra={"url": url, "error": str(exc)})
            return False