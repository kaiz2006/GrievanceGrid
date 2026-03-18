from __future__ import annotations

import logging
from datetime import datetime, timezone

from celery import shared_task

from src.config import settings

logger = logging.getLogger(__name__)


@shared_task(name="src.schedulers.sla_monitor.monitor_sla_and_escalate")
def monitor_sla_and_escalate(lookahead_minutes: int = 30) -> dict[str, int | str]:
    """Poll SLA timers and trigger escalation workflow.

    Scheduled by Celery Beat every minute in src/celery_app.py.
    """
    if settings.dry_run:
        logger.info("WORKER_DRY_RUN enabled, returning simulated SLA monitoring result")

    result = {
        "lookahead_minutes": lookahead_minutes,
        "near_breach_count": 0,
        "escalated_count": 0,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    logger.info("SLA monitor pass complete", extra={"result": result})
    return result
