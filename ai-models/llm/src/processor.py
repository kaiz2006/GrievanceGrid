from __future__ import annotations

import hashlib
import json
import logging
import os
from pathlib import Path
from typing import Any

from client import vllm_client
from config import llm_config

logger = logging.getLogger(__name__)

try:
    from sentence_transformers import SentenceTransformer

    HAS_LOCAL_ML = True
except ImportError:
    HAS_LOCAL_ML = False
    logger.warning("Local ML libraries (sentence_transformers) not found.")

try:
    from openai import OpenAI

    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

try:
    from qdrant_client import QdrantClient

    HAS_QDRANT = True
except ImportError:
    HAS_QDRANT = False


def _deterministic_embedding(text: str, dim: int = 768) -> list[float]:
    digest = hashlib.sha256(text.encode("utf-8")).digest()
    out: list[float] = []
    while len(out) < dim:
        for byte in digest:
            out.append((byte / 255.0) * 2.0 - 1.0)
            if len(out) >= dim:
                break
        digest = hashlib.sha256(digest).digest()
    return out


class GrievanceLLMProcessor:
    def __init__(self) -> None:
        self.use_gpu = os.getenv("USE_GPU", "true").lower() == "true"
        self.device = "cuda" if self.use_gpu else "cpu"
        self._validate_required_assets()

        self.embedder = None
        if HAS_LOCAL_ML:
            try:
                model_id = os.getenv("SENTENCE_TRANSFORMER_ID", "all-MiniLM-L6-v2")
                self.embedder = SentenceTransformer(model_id, device=self.device)
            except Exception as exc:
                logger.error("Failed to load local embedding model", extra={"error": str(exc)})

        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.openai_client = OpenAI(api_key=self.openai_key) if self.openai_key and HAS_OPENAI else None

        self.qdrant_url = os.getenv("QDRANT_URL", "http://qdrant:6333")
        self.qdrant_client = QdrantClient(url=self.qdrant_url) if HAS_QDRANT else None

    def _validate_required_assets(self) -> None:
        missing_paths: list[str] = []
        for path in (
            llm_config.classification_prompt_path,
            llm_config.routing_prompt_path,
            llm_config.resolution_prompt_path,
        ):
            if not Path(path).exists():
                missing_paths.append(path)

        if llm_config.is_strict_mode and llm_config.use_vllm:
            artifact_root = Path(llm_config.llm_model_artifact_path)
            if not artifact_root.exists():
                missing_paths.append(str(artifact_root))

        if missing_paths and llm_config.is_strict_mode:
            raise RuntimeError(f"Missing required LLM assets: {', '.join(missing_paths)}")

    def _read_prompt(self, path: str, **kwargs: Any) -> str:
        with open(path, "r", encoding="utf-8") as handle:
            template = handle.read()
        return template.format(**kwargs)

    def process_unstructured_text(self, text: str) -> dict[str, Any]:
        prompt = self._read_prompt(llm_config.classification_prompt_path, text=text)

        result = vllm_client.chat_json(prompt)
        if isinstance(result, dict):
            return result

        if self.openai_client:
            try:
                response = self.openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"},
                    max_tokens=llm_config.max_tokens,
                    temperature=llm_config.temperature,
                )
                return json.loads(response.choices[0].message.content)
            except Exception as exc:
                logger.error("OpenAI fallback failed", extra={"error": str(exc)})

        raise RuntimeError("LLM processing failed. No valid classification from vLLM or OpenAI in fake-free mode.")

    def generate_embedding(self, text: str) -> list[float]:
        if self.embedder is not None:
            try:
                return self.embedder.encode(text).tolist()
            except Exception as exc:
                logger.error("Local embedding failed", extra={"error": str(exc)})

        vector = vllm_client.embedding(text)
        if vector:
            return vector

        if self.openai_client:
            try:
                response = self.openai_client.embeddings.create(model="text-embedding-3-small", input=text)
                return [float(value) for value in response.data[0].embedding]
            except Exception as exc:
                logger.error("OpenAI embedding fallback failed", extra={"error": str(exc)})

        # We keep deterministic hash only as a last resort technical fallback, not a "fake" inference
        return _deterministic_embedding(text)

    def suggest_resolution(self, grievance: dict[str, Any]) -> str:
        text = str(grievance.get("text") or grievance.get("summary") or "")
        category = str(grievance.get("category") or "OTHER")

        historical_docs: list[str] = []
        if self.qdrant_client and text:
            vector = self.generate_embedding(text)
            try:
                results = self.qdrant_client.search(collection_name="grievances", query_vector=vector, limit=3)
                for result in results:
                    payload = result.payload or {}
                    historical_docs.append(
                        f"- Resolved by {payload.get('department')}: {payload.get('resolution_notes')}"
                    )
            except Exception as exc:
                logger.error("Qdrant search failed", extra={"error": str(exc)})

        history_str = "\n".join(historical_docs) if historical_docs else "No highly similar resolved cases found."
        prompt = self._read_prompt(
            llm_config.resolution_prompt_path,
            text=text,
            category=category,
            historical_solutions=history_str,
        )

        text_result = vllm_client.chat_text(prompt)
        if text_result:
            return text_result

        if self.openai_client:
            try:
                response = self.openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.3,
                    max_tokens=200,
                )
                return str(response.choices[0].message.content)
            except Exception as exc:
                logger.error("Resolution synthesis failed", extra={"error": str(exc)})

        raise RuntimeError("LLM resolution synthesis failed. No valid output from vLLM or OpenAI.")


processor = GrievanceLLMProcessor()
