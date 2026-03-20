from __future__ import annotations

import logging
from datetime import date, datetime, timezone

from celery import shared_task

from src.clients import BackendClient
from src.config import settings

logger = logging.getLogger(__name__)
backend_client = BackendClient()


@shared_task(name="src.schedulers.report_generator.generate_daily_report_snapshot")
def generate_daily_report_snapshot(target_day: str | None = None) -> dict[str, str | int]:
    """Generate and persist daily analytics snapshot via backend callback."""
    report_day = target_day or date.today().isoformat()
    records_written = 0

    if settings.dry_run:
        logger.info("WORKER_DRY_RUN enabled, simulating daily snapshot persistence")
        records_written = 1
        persisted = False
    else:
        persisted = backend_client.post_daily_report_snapshot(report_day)
        records_written = 1 if persisted else 0

    result = {
        "report_day": report_day,
        "records_written": records_written,
        "persisted": persisted,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    logger.info("Daily report snapshot complete", extra={"result": result})
    return result