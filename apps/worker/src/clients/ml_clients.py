from __future__ import annotations

import logging
from collections.abc import Sequence
from typing import Any

import httpx

from src.config import settings

logger = logging.getLogger(__name__)


def _coerce_vector(value: Any) -> list[float] | None:
    if not isinstance(value, Sequence) or isinstance(value, (str, bytes)):
        return None

    vector: list[float] = []
    for item in value:
        if isinstance(item, (int, float)):
            vector.append(float(item))
        else:
            return None
    return vector


class _BaseHttpClient:
    def __init__(self, base_url: str) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = settings.ml_timeout_seconds

    def _post(self, path: str, payload: dict[str, Any]) -> dict[str, Any] | None:
        url = f"{self.base_url}{path}"
        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.post(url, json=payload)
            response.raise_for_status()
            body = response.json()
            if isinstance(body, dict):
                return body
            return None
        except Exception as exc:
            logger.warning("ML service request failed", extra={"url": url, "error": str(exc)})
            return None


class LlmClient(_BaseHttpClient):
    def __init__(self) -> None:
        super().__init__(settings.llm_service_url)

    def classify(self, text: str) -> dict[str, Any] | None:
        return self._post("/classify", {"text": text})

    def embed(self, text: str) -> list[float] | None:
        payload = self._post("/embed", {"text": text})
        if not payload:
            return None

        return _coerce_vector(payload.get("embedding"))

    def transcribe(self, audio_url: str) -> dict[str, Any] | None:
        return self._post("/transcribe", {"audio_url": audio_url})


class CvClient(_BaseHttpClient):
    def __init__(self) -> None:
        super().__init__(settings.cv_service_url)

    def estimate_severity(self, image_url: str) -> float | None:
        payload = self._post("/severity", {"image_url": image_url})
        if not payload:
            return None

        score = payload.get("severity")
        if isinstance(score, (int, float)):
            return float(score)
        return None


class GnnClient(_BaseHttpClient):
    def __init__(self) -> None:
        super().__init__(settings.gnn_service_url)

    def predict_route(self, grievance_payload: dict[str, Any]) -> dict[str, Any] | None:
        return self._post("/route", grievance_payload)