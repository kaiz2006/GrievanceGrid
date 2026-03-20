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
        self._headers = {"X-Internal-Token": settings.internal_worker_token}

    def _get(self, path: str, use_internal_auth: bool = False) -> list[dict[str, Any]] | None:
        url = f"{self.base_url}{path}"
        headers = self._headers if use_internal_auth else None
        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.get(url, headers=headers)

            if response.status_code == 200:
                return response.json()

            logger.info(
                "Backend GET endpoint unavailable",
                extra={"url": url, "status_code": response.status_code},
            )
            return None
        except Exception as exc:
            logger.info("Backend GET failed", extra={"url": url, "error": str(exc)})
            return None

    def _post(self, path: str, payload: dict[str, Any], use_internal_auth: bool = False) -> bool:
        url = f"{self.base_url}{path}"
        headers = self._headers if use_internal_auth else None
        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.post(url, json=payload, headers=headers)

            if response.status_code in (200, 201, 202, 204):
                return True

            logger.info(
                "Backend callback endpoint unavailable or not yet implemented",
                extra={"url": url, "status_code": response.status_code},
            )
            return False
        except Exception as exc:
            logger.info("Backend callback failed", extra={"url": url, "error": str(exc)})
            return False

    def post_ai_result(self, grievance_id: str, result: dict[str, Any]) -> bool:
        return self._post(f"/api/v1/grievances/{grievance_id}/ai-result", result)

    def post_voice_result(self, grievance_id: str, result: dict[str, Any]) -> bool:
        return self._post(f"/api/v1/voice/{grievance_id}/result", result)

    def post_notification_result(self, grievance_id: str, result: dict[str, Any]) -> bool:
        return self._post(f"/api/v1/grievances/{grievance_id}/notification-result", result)

    def post_daily_report_snapshot(self, target_day: str | None = None) -> bool:
        payload = {"target_day": target_day}
        return self._post("/api/v1/analytics/snapshot", payload, use_internal_auth=True)

    def get_infrastructure_assets(self) -> list[dict[str, Any]]:
        """Fetch active assets from backend for risk calculation."""
        # Using internal auth for the new analytics endpoints
        result = self._get("/api/v1/analytics/infrastructure/assets", use_internal_auth=True)
        return result if result is not None else []

    def post_infrastructure_risk_update(self, updates: list[dict[str, Any]]) -> bool:
        """Post batch risk score updates back to backend."""
        payload = {"updates": updates}
        return self._post("/api/v1/analytics/infrastructure/risk-update", payload, use_internal_auth=True)