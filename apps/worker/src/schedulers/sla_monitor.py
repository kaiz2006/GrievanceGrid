from __future__ import annotations

import logging
from datetime import datetime, timezone

from celery import shared_task

from src.config import settings

from src.clients import BackendClient

logger = logging.getLogger(__name__)
backend_client = BackendClient()


@shared_task(name="src.schedulers.sla_monitor.monitor_sla_and_escalate")
def monitor_sla_and_escalate(lookahead_minutes: int = 60) -> dict[str, int | str]:
    """Poll SLA timers and trigger escalation workflow.
    
    Scheduled by Celery Beat every minute.
    """
    if settings.dry_run:
        logger.info("WORKER_DRY_RUN enabled, returning simulated SLA monitoring result")
        return {
            "lookahead_minutes": lookahead_minutes,
            "near_breach_count": 0,
            "escalated_count": 0,
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }

    # Fetch active timers from backend
    try:
        # We need an endpoint in the backend for this. 
        # Assuming BackendClient has a method to get timers.
        # If not, we'll need to implement it or use a direct DB query if shared.
        # For now, let's assume we use the API.
        timers = backend_client.get_active_sla_timers()
    except Exception as e:
        logger.error(f"Failed to fetch SLA timers: {e}")
        return {"error": str(e)}

    now = datetime.now(timezone.utc)
    lookahead_limit = now + timedelta(minutes=lookahead_minutes)
    
    escalated_ids = []
    near_breach_ids = []

    for timer in timers:
        deadline = datetime.fromisoformat(timer["deadline_at"].replace("Z", "+00:00"))
        
        if deadline <= now and not timer.get("is_breached"):
            escalated_ids.append(timer["grievance_id"])
        elif deadline <= lookahead_limit and not timer.get("is_breached"):
            near_breach_ids.append(timer["grievance_id"])

    # Trigger escalations
    for g_id in escalated_ids:
        backend_client.post_sla_escalation(g_id)
        logger.warning(f"SLA BREACH DETECTED: Escalating grievance {g_id}")

    result = {
        "lookahead_minutes": lookahead_minutes,
        "near_breach_count": len(near_breach_ids),
        "escalated_count": len(escalated_ids),
        "generated_at": now.isoformat(),
    }
    logger.info("SLA monitor pass complete", extra={"result": result})
    return result
