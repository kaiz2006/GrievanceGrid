from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from celery import shared_task
from src.clients import BackendClient

logger = logging.getLogger(__name__)
backend_client = BackendClient()

@shared_task(
    bind=True,
    name="src.tasks.simulation.simulate_grievance_lifecycle",
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 1},
)
def simulate_grievance_lifecycle(self, grievance_id: str, stage: int = 0) -> dict[str, Any]:
    """
    Simulation State Machine:
    0: Intake -> AI Analysis (PENDING_CLASSIFICATION) (T+2m)
    1: Analysis -> Routing (PENDING_ASSIGNMENT) (T+3m)
    2: Routing -> Dispatch (ASSIGNED) (T+5m)
    3: Dispatch -> Fixing (IN_PROGRESS) (T+10m)
    4: Fixing -> Verified (RESOLVED) (T+15m)
    """
    stages = [
        {"status": "PENDING_CLASSIFICATION", "notes": "AI is analyzing the grievance context...", "delay": 120},
        {"status": "PENDING_ASSIGNMENT", "notes": "AI Audit Passed. Optimizing route for field crews...", "delay": 180},
        {"status": "ASSIGNED", "notes": "Technical Crew dispatched to location.", "delay": 300},
        {"status": "IN_PROGRESS", "notes": "On-site hardware remediation in progress.", "delay": 600},
        {"status": "RESOLVED", "notes": "Grid integrity restored. Verification complete.", "delay": 0},
    ]

    if stage >= len(stages):
        return {"status": "simulation_complete", "grievance_id": grievance_id}

    current_stage = stages[stage]
    
    # Update Status
    logger.info(f"Simulation Stage {stage}: Updating status to {current_stage['status']} for {grievance_id}")
    success = backend_client.update_grievance_status(
        grievance_id, 
        current_stage["status"], 
        current_stage["notes"]
    )

    if not success:
        logger.error(f"Failed to update status in simulation for {grievance_id}")
        return {"status": "failed", "stage": stage}

    # Schedule next stage if available
    if stage + 1 < len(stages):
        next_delay = current_stage["delay"]
        simulate_grievance_lifecycle.apply_async(
            args=[grievance_id, stage + 1],
            countdown=next_delay
        )

    return {
        "status": "stage_complete",
        "stage": stage,
        "grievance_id": grievance_id,
        "next_stage_delay": next_delay if stage + 1 < len(stages) else 0
    }
