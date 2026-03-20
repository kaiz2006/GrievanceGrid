from __future__ import annotations

import json
import logging
from typing import Any

import httpx

from config import llm_config

logger = logging.getLogger(__name__)


class VllmClient:
    """Thin HTTP client for vLLM OpenAI-compatible endpoints."""

    def __init__(self) -> None:
        self.enabled = llm_config.use_vllm
        self.base_url = llm_config.vllm_base_url.rstrip("/")
        self.model = llm_config.model_name
        self.timeout_seconds = llm_config.timeout_seconds

    def _post(self, path: str, payload: dict[str, Any]) -> dict[str, Any] | None:
        if not self.enabled:
            return None

        url = f"{self.base_url}{path}"
        headers = {"Content-Type": "application/json"}
        if llm_config.vllm_api_key:
            headers["Authorization"] = f"Bearer {llm_config.vllm_api_key}"

        try:
            with httpx.Client(timeout=self.timeout_seconds) as client:
                response = client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            body = response.json()
            return body if isinstance(body, dict) else None
        except Exception as exc:
            logger.warning("vLLM request failed", extra={"url": url, "error": str(exc)})
            return None

    def chat_json(self, prompt: str) -> dict[str, Any] | None:
        body = self._post(
            "/chat/completions",
            {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": llm_config.temperature,
                "max_tokens": llm_config.max_tokens,
            },
        )
        if not body:
            return None

        try:
            content = body["choices"][0]["message"]["content"]
            if isinstance(content, dict):
                return content
            if isinstance(content, str):
                return json.loads(content)
        except Exception as exc:
            logger.warning("vLLM JSON parse failed", extra={"error": str(exc)})
        return None

    def chat_text(self, prompt: str) -> str | None:
        body = self._post(
            "/chat/completions",
            {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2,
                "max_tokens": min(llm_config.max_tokens, 256),
            },
        )
        if not body:
            return None

        try:
            content = body["choices"][0]["message"]["content"]
            return str(content) if content is not None else None
        except Exception:
            return None

    def embedding(self, text: str) -> list[float] | None:
        body = self._post(
            "/embeddings",
            {
                "model": llm_config.embedding_model,
                "input": text,
            },
        )
        if not body:
            return None

        try:
            vector = body["data"][0]["embedding"]
            if isinstance(vector, list) and vector and isinstance(vector[0], (int, float)):
                return [float(item) for item in vector]
        except Exception as exc:
            logger.warning("vLLM embedding parse failed", extra={"error": str(exc)})
        return None


vllm_client = VllmClient()
