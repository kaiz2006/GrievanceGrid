from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class ApiSettings:
    celery_broker_url: str
    celery_result_backend: str


settings = ApiSettings(
    celery_broker_url=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"),
    celery_result_backend=os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/1"),
)