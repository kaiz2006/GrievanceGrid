from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.repositories import grievance_repository

router = APIRouter()


class TrackingResponse(BaseModel):
	grid_id: str
	current_status: str
	timeline: list[dict[str, Any]]


@router.get("/{grid_id}", response_model=TrackingResponse)
async def track_grievance(grid_id: str) -> TrackingResponse:
	grievance = grievance_repository.get_by_grid_id(grid_id)
	if grievance is None:
		raise HTTPException(status_code=404, detail="Grid ID not found")

	return TrackingResponse(
		grid_id=grievance["grid_id"],
		current_status=grievance["status"],
		timeline=grievance.get("timeline", []),
	)
