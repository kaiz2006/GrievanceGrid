from __future__ import annotations

import asyncio
from typing import Any

import httpx

from src.core.config import settings


class AIService:
    """HTTP wrappers for LLM/CV/GNN microservices with retry and fallback handling."""

    def __init__(
        self,
        llm_base_url: str | None = None,
        cv_base_url: str | None = None,
        gnn_base_url: str | None = None,
        timeout_seconds: float = 10.0,
        max_retries: int = 3,
    ) -> None:
        self.llm_base_url = (llm_base_url or settings.llm_api_url).rstrip("/")
        self.cv_base_url = (cv_base_url or settings.cv_api_url).rstrip("/")
        self.gnn_base_url = (gnn_base_url or settings.gnn_api_url).rstrip("/")
        self.timeout_seconds = timeout_seconds
        self.max_retries = max_retries

    async def _request_with_retry(
        self,
        base_url: str,
        path: str,
        payload: dict[str, Any],
    ) -> dict[str, Any] | None:
        url = f"{base_url}{path}"

        for attempt in range(1, self.max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                    response = await client.post(url, json=payload)

                if response.status_code >= 500:
                    raise RuntimeError(f"Upstream server error: {response.status_code}")
                if response.status_code >= 400:
                    return None

                data = response.json()
                return data if isinstance(data, dict) else {"result": data}
            except Exception:
                if attempt >= self.max_retries:
                    break
                await asyncio.sleep(2 ** (attempt - 1))

        return None

    async def classify_grievance(self, text: str) -> dict[str, Any]:
        payload = {"text": text}
        result = await self._request_with_retry(self.llm_base_url, "/classify", payload)
        if result is not None:
            return result
        return {
            "category": "OTHER",
            "priority": "MEDIUM",
            "summary": text[:280],
            "source": "fallback",
        }

    async def evaluate_image_severity(self, image_url: str) -> dict[str, Any]:
        payload = {"image_url": image_url}
        result = await self._request_with_retry(self.cv_base_url, "/severity", payload)
        if result is not None:
            return result
        return {"severity": None, "source": "fallback"}

    async def predict_department(self, grievance_payload: dict[str, Any]) -> dict[str, Any]:
        result = await self._request_with_retry(self.gnn_base_url, "/route", grievance_payload)
        if result is not None:
            return result
        return {"department": "PUBLIC_WORKS", "source": "fallback"}

    async def enrich_grievance(
        self,
        text: str,
        image_url: str | None = None,
        routing_payload: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        classification = await self.classify_grievance(text)
        severity = await self.evaluate_image_severity(image_url) if image_url else {"severity": None}
        department = await self.predict_department(routing_payload or {"text": text})

        return {
            "classification": classification,
            "severity": severity,
            "department": department,
        }
