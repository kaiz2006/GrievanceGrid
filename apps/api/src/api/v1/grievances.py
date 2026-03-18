from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter
from pydantic import BaseModel, Field

from src.core.worker import dispatch_task

router = APIRouter()


class GrievanceCreateRequest(BaseModel):
	title: str = Field(min_length=3, max_length=160)
	description: str = Field(min_length=5)
	location_text: str | None = None
	before_photo_url: str | None = None
	hint_category: str | None = None
	hint_priority: str | None = None
	hint_department: str | None = None


class GrievanceCreateResponse(BaseModel):
	grievance_id: str
	grid_id: str
	processing_task_id: str
	submitted_at: str


def _build_grid_id() -> str:
	year = datetime.now(timezone.utc).year
	suffix = uuid4().hex[:6].upper()
	return f"GRI-{year}-{suffix}"


@router.post("", response_model=GrievanceCreateResponse)
async def create_grievance(payload: GrievanceCreateRequest) -> GrievanceCreateResponse:
	grievance_id = str(uuid4())
	grid_id = _build_grid_id()

	task_id = dispatch_task(
		"src.tasks.ai_processing.process_grievance_ai",
		grievance_id,
		payload.model_dump(),
	)

	return GrievanceCreateResponse(
		grievance_id=grievance_id,
		grid_id=grid_id,
		processing_task_id=task_id,
		submitted_at=datetime.now(timezone.utc).isoformat(),
	)
