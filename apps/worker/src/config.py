from __future__ import annotations

import os
from dataclasses import dataclass


def _to_bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class WorkerSettings:
    app_name: str
    broker_url: str
    result_backend: str
    api_base_url: str
    llm_service_url: str
    cv_service_url: str
    gnn_service_url: str
    qdrant_url: str
    qdrant_collection: str
    redis_pubsub_url: str
    embedding_dimension: int
    ml_timeout_seconds: float
    log_level: str
    timezone: str
    dry_run: bool


settings = WorkerSettings(
    app_name=os.getenv("WORKER_APP_NAME", "grievancegrid-worker"),
    broker_url=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"),
    result_backend=os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/1"),
    api_base_url=os.getenv("API_BASE_URL", "http://localhost:8000"),
    llm_service_url=os.getenv("LLM_SERVICE_URL", "http://localhost:8101"),
    cv_service_url=os.getenv("CV_SERVICE_URL", "http://localhost:8102"),
    gnn_service_url=os.getenv("GNN_SERVICE_URL", "http://localhost:8103"),
    qdrant_url=os.getenv("QDRANT_URL", "http://localhost:6333"),
    qdrant_collection=os.getenv("QDRANT_COLLECTION", "grievances"),
    redis_pubsub_url=os.getenv("REDIS_PUBSUB_URL", os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")),
    embedding_dimension=int(os.getenv("EMBEDDING_DIMENSION", "768")),
    ml_timeout_seconds=float(os.getenv("ML_TIMEOUT_SECONDS", "8.0")),
    log_level=os.getenv("WORKER_LOG_LEVEL", "INFO"),
    timezone=os.getenv("WORKER_TIMEZONE", "UTC"),
    dry_run=_to_bool(os.getenv("WORKER_DRY_RUN"), default=True),
)
