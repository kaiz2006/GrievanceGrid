from __future__ import annotations

from celery import Celery

from src.core.config import settings

celery_client = Celery(
    "grievancegrid-api",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
)


def dispatch_task(task_name: str, *args, **kwargs) -> str:
    """Dispatch a task by name and return Celery task id."""
    task = celery_client.send_task(task_name, args=args, kwargs=kwargs)
    return task.id