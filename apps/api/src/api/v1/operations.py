from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Header, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import settings
from src.core.database import get_db_session
from src.core.dependencies import require_admin
from src.repositories.operations import VerificationRepository # I'll assume this exists or create it
from src.repositories.grievances import GrievanceRepository
from src.repositories.slas import SLARepository

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


# =============================================================================
# SLA STATISTICS ENDPOINT (Admin Dashboard)
# =============================================================================


class SLAStatsResponse(BaseModel):
	total_active: int
	response_sla: dict[str, Any]
	resolution_sla: dict[str, Any]
	average_time_remaining_minutes: float | None = None


@router.get("/sla/stats", response_model=SLAStatsResponse)
async def get_sla_stats(
	admin_user: dict = Depends(require_admin),
	db: AsyncSession = Depends(get_db_session),
) -> SLAStatsResponse:
	"""Get SLA compliance statistics for admin dashboard."""
	repo = GrievanceRepository(db)

	# Get response SLA stats
	response_stats = await repo.fetch_one(
		"""
		SELECT
			COUNT(*) as total,
			COUNT(*) FILTER (WHERE is_breached = false AND deadline_at < CURRENT_TIMESTAMP) as met,
			COUNT(*) FILTER (WHERE is_breached = true) as breached,
			COUNT(*) FILTER (WHERE is_breached = false AND deadline_at > CURRENT_TIMESTAMP) as pending
		FROM sla_timers
		WHERE sla_type = 'RESPONSE'::sla_type
		"""
	)

	# Get resolution SLA stats
	resolution_stats = await repo.fetch_one(
		"""
		SELECT
			COUNT(*) as total,
			COUNT(*) FILTER (WHERE is_breached = false AND deadline_at < CURRENT_TIMESTAMP) as met,
			COUNT(*) FILTER (WHERE is_breached = true) as breached,
			COUNT(*) FILTER (WHERE is_breached = false AND deadline_at > CURRENT_TIMESTAMP) as pending
		FROM sla_timers
		WHERE sla_type = 'RESOLUTION'::sla_type
		"""
	)

	# Get average time remaining for active timers
	avg_time = await repo.fetch_one(
		"""
		SELECT AVG(EXTRACT(EPOCH FROM (deadline_at - CURRENT_TIMESTAMP)) / 60) as avg_minutes
		FROM sla_timers
		WHERE is_breached = false AND deadline_at > CURRENT_TIMESTAMP
		"""
	)

	def calc_rate(met: int, total: int) -> float:
		return round(met / total * 100, 1) if total > 0 else 0.0

	resp_total = response_stats.get("total", 0) or 0
	resp_met = response_stats.get("met", 0) or 0
	res_total = resolution_stats.get("total", 0) or 0
	res_met = resolution_stats.get("met", 0) or 0

	return SLAStatsResponse(
		total_active=(response_stats.get("pending", 0) or 0) + (resolution_stats.get("pending", 0) or 0),
		response_sla={
			"total": resp_total,
			"met": resp_met,
			"breached": response_stats.get("breached", 0) or 0,
			"pending": response_stats.get("pending", 0) or 0,
			"compliance_rate": calc_rate(resp_met, resp_total),
		},
		resolution_sla={
			"total": res_total,
			"met": res_met,
			"breached": resolution_stats.get("breached", 0) or 0,
			"pending": resolution_stats.get("pending", 0) or 0,
			"compliance_rate": calc_rate(res_met, res_total),
		},
		average_time_remaining_minutes=round(avg_time.get("avg_minutes", 0) or 0, 1),
	)


# =============================================================================
# SLA AT-RISK ENDPOINT (Admin Dashboard)
# =============================================================================


class AtRiskItem(BaseModel):
	grievance_id: str
	grid_id: str
	title: str
	status: str
	priority: str
	deadline_at: str
	minutes_remaining: float
	sla_type: str


class AtRiskResponse(BaseModel):
	count: int
	items: list[AtRiskItem]


@router.get("/sla/at-risk", response_model=AtRiskResponse)
async def get_sla_at_risk(
	hours: int = Query(default=2, ge=1, le=24, description="Hours threshold for at-risk"),
	limit: int = Query(default=50, ge=1, le=200),
	admin_user: dict = Depends(require_admin),
	db: AsyncSession = Depends(get_db_session),
) -> AtRiskResponse:
	"""Get grievances with SLA deadlines at risk within specified hours."""
	repo = GrievanceRepository(db)

	rows = await repo.fetch_all(
		"""
		SELECT
			g.id as grievance_id,
			g.grid_id,
			g.title,
			g.status,
			g.priority,
			s.deadline_at,
			s.sla_type,
			EXTRACT(EPOCH FROM (s.deadline_at - CURRENT_TIMESTAMP)) / 60 as minutes_remaining
		FROM grievances g
		JOIN sla_timers s ON s.grievance_id = g.id
		WHERE s.is_breached = false
			AND s.deadline_at BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '1 hour' * :hours
			AND g.status NOT IN ('RESOLVED', 'VERIFIED', 'CLOSED', 'ESCALATED')
		ORDER BY s.deadline_at ASC
		LIMIT :limit
		""",
		{"hours": hours, "limit": limit},
	)

	items = [
		AtRiskItem(
			grievance_id=str(row["grievance_id"]),
			grid_id=str(row["grid_id"]),
			title=str(row["title"]),
			status=str(row["status"]),
			priority=str(row["priority"]),
			deadline_at=str(row["deadline_at"]),
			minutes_remaining=round(row["minutes_remaining"] or 0, 1),
			sla_type=str(row["sla_type"]),
		)
		for row in rows
	]

	return AtRiskResponse(count=len(items), items=items)
