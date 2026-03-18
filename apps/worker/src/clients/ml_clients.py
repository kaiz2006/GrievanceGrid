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
                if isinstance(body.get("data"), dict):
                    return body["data"]
                return body
            return None
        except Exception as exc:
            logger.warning("ML service request failed", extra={"url": url, "error": str(exc)})
            return None

    def _post_candidates(self, paths: list[str], payload: dict[str, Any]) -> dict[str, Any] | None:
        for path in paths:
            result = self._post(path, payload)
            if result is not None:
                return result
        return None


class LlmClient(_BaseHttpClient):
    def __init__(self) -> None:
        super().__init__(settings.llm_service_url)

    def classify(self, text: str) -> dict[str, Any] | None:
        payload = self._post_candidates(
            ["/classify", "/process-text"],
            {"text": text, "input": text},
        )
        if not payload:
            return None

        return {
            "category": payload.get("category"),
            "priority": payload.get("priority"),
            "summary": payload.get("summary"),
            "department": payload.get("department") or payload.get("assigned_department"),
        }

    def embed(self, text: str) -> list[float] | None:
        payload = self._post_candidates(
            ["/embed", "/embeddings"],
            {"text": text, "input": text},
        )
        if not payload:
            return None

        vector = _coerce_vector(payload.get("embedding"))
        if vector is not None:
            return vector

        vector = _coerce_vector(payload.get("vector"))
        if vector is not None:
            return vector

        data = payload.get("data")
        if isinstance(data, list) and data:
            return _coerce_vector(data[0].get("embedding")) if isinstance(data[0], dict) else None
        return None

    def transcribe(self, audio_url: str) -> dict[str, Any] | None:
        payload = self._post_candidates(
            ["/transcribe", "/voice/transcribe"],
            {"audio_url": audio_url, "audio_path": audio_url},
        )
        if not payload:
            return None

        transcript = payload.get("transcription") or payload.get("text") or payload.get("transcript")
        summary = payload.get("summary")
        return {"transcription": transcript, "summary": summary}


class CvClient(_BaseHttpClient):
    def __init__(self) -> None:
        super().__init__(settings.cv_service_url)

    def estimate_severity(self, image_url: str) -> float | None:
        payload = self._post_candidates(
            ["/severity", "/estimate-severity"],
            {"image_url": image_url, "image_path": image_url},
        )
        if not payload:
            return None

        score = payload.get("severity")
        if not isinstance(score, (int, float)):
            score = payload.get("severity_score")
        if not isinstance(score, (int, float)):
            score = payload.get("score")
        if isinstance(score, (int, float)):
            return float(score)
        return None


class GnnClient(_BaseHttpClient):
    def __init__(self) -> None:
        super().__init__(settings.gnn_service_url)

    def predict_route(self, grievance_payload: dict[str, Any]) -> dict[str, Any] | None:
        payload = self._post_candidates(["/route", "/predict-route"], grievance_payload)
        if not payload:
            return None

        department = payload.get("department")
        if not department:
            top_departments = payload.get("top_departments")
            if isinstance(top_departments, list) and top_departments:
                first = top_departments[0]
                if isinstance(first, dict):
                    department = first.get("department") or first.get("name")
                elif isinstance(first, str):
                    department = first

        return {
            "department": department,
            "top_departments": payload.get("top_departments"),
            "raw": payload,
        }