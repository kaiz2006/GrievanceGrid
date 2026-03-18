from __future__ import annotations

import logging
from datetime import date, datetime, timezone

from celery import shared_task

from src.config import settings

logger = logging.getLogger(__name__)


@shared_task(name="src.schedulers.report_generator.generate_daily_report_snapshot")
def generate_daily_report_snapshot(target_day: str | None = None) -> dict[str, str | int]:
    """Generate daily reporting snapshot placeholder.

    This is listed in docs/FOLDER_STRUCTURE.md for worker schedulers.
    """
    if settings.dry_run:
        logger.info("WORKER_DRY_RUN enabled, returning simulated report snapshot")

    report_day = target_day or date.today().isoformat()
    result = {
        "report_day": report_day,
        "records_written": 0,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    logger.info("Daily report snapshot complete", extra={"result": result})
    return result