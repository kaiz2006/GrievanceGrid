from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import settings
from src.core.database import get_db_session
from src.repositories.operations import VerificationRepository # I'll assume this exists or create it
from src.repositories.grievances import GrievanceRepository

router = APIRouter()
logger = logging.getLogger(__name__)

async def verify_internal_token(x_internal_token: str = Header(...)):
    if x_internal_token != settings.internal_worker_token:
        raise HTTPException(status_code=403, detail="Invalid internal token")
    return x_internal_token

@router.get("/sla/active")
async def get_active_sla_timers(
    db: AsyncSession = Depends(get_db_session),
    _token: str = Depends(verify_internal_token)
) -> list[dict[str, Any]]:
    """Return all non-breached SLA timers for the worker to monitor."""
    # Using raw SQL via repo or direct fetch for simplicity in this hardened path
    repo = GrievanceRepository(db)
    timers = await repo.fetch_all(
        """
        SELECT grievance_id, sla_type, deadline_at, is_breached
        FROM sla_timers
        WHERE is_breached = false
        """
    )
    return timers

@router.post("/sla/{grievance_id}/escalate")
async def escalate_grievance(
    grievance_id: str,
    db: AsyncSession = Depends(get_db_session),
    _token: str = Depends(verify_internal_token)
):
    """Mark a grievance as breached and escalated."""
    repo = GrievanceRepository(db)
    
    # Update timer
    await repo.execute(
        "UPDATE sla_timers SET is_breached = true, updated_at = CURRENT_TIMESTAMP WHERE grievance_id = :gid",
        {"gid": grievance_id}
    )
    
    # Update grievance status
    await repo.update_status(
        grievance_id, 
        status="ESCALATED", 
        notes="Automated SLA breach escalation triggered by worker monitor."
    )
    
    return {"status": "escalated", "grievance_id": grievance_id}
