from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.repositories.grievances import GrievanceRepository
from src.repositories.slas import SLARepository

router = APIRouter()


class TrackingResponse(BaseModel):
	grid_id: str
	current_status: str
	current_sla_type: str | None = None
	sla_remaining_seconds: int | None = None
	sla_deadlines: dict[str, str]
	timeline: list[dict[str, Any]]


@router.get("/{grid_id}", response_model=TrackingResponse)
async def track_grievance(
	grid_id: str,
	db: AsyncSession = Depends(get_db_session),
) -> TrackingResponse:
	repo = GrievanceRepository(db)
	sla_repo = SLARepository(db)
	grievance = await repo.get_by_grid_id(grid_id)
	if grievance is None:
		raise HTTPException(status_code=404, detail="Grid ID not found")
	timeline = await repo.get_timeline(str(grievance["id"]))

	sla_rows = await sla_repo.get_by_grievance(str(grievance["id"]))
	now = datetime.now(timezone.utc)
	current_sla_type: str | None = None
	sla_remaining_seconds: int | None = None
	sla_deadlines: dict[str, str] = {}

	for sla in sla_rows:
		sla_type = str(sla.get("sla_type"))
		deadline_raw = sla.get("deadline_at")
		if deadline_raw is None:
			continue
		deadline_at = deadline_raw if isinstance(deadline_raw, datetime) else datetime.fromisoformat(str(deadline_raw).replace("Z", "+00:00"))
		sla_deadlines[sla_type] = deadline_at.isoformat()
		if bool(sla.get("is_breached")):
			continue
		remaining = int((deadline_at - now).total_seconds())
		if sla_remaining_seconds is None or remaining < sla_remaining_seconds:
			sla_remaining_seconds = remaining
			current_sla_type = sla_type

	return TrackingResponse(
		grid_id=grievance["grid_id"],
		current_status=grievance["status"],
		current_sla_type=current_sla_type,
		sla_remaining_seconds=sla_remaining_seconds,
		sla_deadlines=sla_deadlines,
		timeline=[
			{
				"status": str(event.get("status") or "UPDATED"),
				"timestamp": str(event.get("timestamp")),
				"description": str(event.get("description") or "Status updated"),
			}
			for event in timeline
		],
	)
