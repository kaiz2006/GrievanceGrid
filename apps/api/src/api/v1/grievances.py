from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, ConfigDict, Field

from src.core.worker import dispatch_task
from src.repositories import grievance_repository

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
	status: str


class GrievanceDetailsResponse(BaseModel):
	grievance_id: str
	grid_id: str
	status: str
	title: str
	description: str
	location_text: str | None = None
	before_photo_url: str | None = None
	hint_category: str | None = None
	hint_priority: str | None = None
	hint_department: str | None = None
	processing_task_id: str
	submitted_at: str
	ai_result: dict[str, Any] | None = None
	timeline: list[dict[str, Any]]


class GrievanceAIResultRequest(BaseModel):
	model_config = ConfigDict(extra="allow")

	grievance_id: str | None = None
	ai_category: str | None = None
	ai_priority: str | None = None
	ai_summary: str | None = None
	damage_severity: float | None = None
	vector_indexed: bool | None = None
	vector_source: str | None = None
	embedding_dimension: int | None = None
	assigned_department: str | None = None
	similar_cases: list[dict[str, Any]] = Field(default_factory=list)
	processed_at: str | None = None


class GrievanceAIResultResponse(BaseModel):
	grievance_id: str
	status: str
	updated_at: str


class GrievanceStatusUpdateRequest(BaseModel):
	status: str = Field(min_length=2, max_length=64)
	notes: str | None = Field(default=None, max_length=500)


class GrievanceFeedbackRequest(BaseModel):
	rating: int = Field(ge=1, le=5)
	comment: str | None = Field(default=None, max_length=1000)
	is_satisfied: bool | None = None


class GrievanceFeedbackResponse(BaseModel):
	grievance_id: str
	rating: int
	submitted_at: str
	message: str


class GrievanceContestRequest(BaseModel):
	reason: str = Field(min_length=5, max_length=2000)
	evidence_photo: str | None = None


class GrievanceContestResponse(BaseModel):
	status: str
	audit_triggered: bool
	audit_id: str
	audit_task_id: str
	message: str


class GrievanceListItem(BaseModel):
	grievance_id: str
	grid_id: str
	status: str
	title: str
	submitted_at: str
	hint_category: str | None = None
	hint_priority: str | None = None
	hint_department: str | None = None
	ai_result: dict[str, Any] | None = None


class GrievanceListResponse(BaseModel):
	count: int
	items: list[GrievanceListItem]


def _build_grid_id() -> str:
	year = datetime.now(timezone.utc).year
	suffix = uuid4().hex[:6].upper()
	return f"GRI-{year}-{suffix}"


@router.post("", response_model=GrievanceCreateResponse)
async def create_grievance(payload: GrievanceCreateRequest) -> GrievanceCreateResponse:
	grievance_id = str(uuid4())
	grid_id = _build_grid_id()
	submitted_at = datetime.now(timezone.utc).isoformat()

	task_id = dispatch_task(
		"src.tasks.ai_processing.process_grievance_ai",
		grievance_id,
		payload.model_dump(),
	)

	grievance_repository.create(
		{
			"grievance_id": grievance_id,
			"grid_id": grid_id,
			"status": "CREATED",
			"submitted_at": submitted_at,
			"processing_task_id": task_id,
			"title": payload.title,
			"description": payload.description,
			"location_text": payload.location_text,
			"before_photo_url": payload.before_photo_url,
			"hint_category": payload.hint_category,
			"hint_priority": payload.hint_priority,
			"hint_department": payload.hint_department,
			"ai_result": None,
			"timeline": [
				{
					"status": "CREATED",
					"timestamp": submitted_at,
					"description": "Grievance submitted successfully",
				}
			],
		}
	)

	return GrievanceCreateResponse(
		grievance_id=grievance_id,
		grid_id=grid_id,
		processing_task_id=task_id,
		submitted_at=submitted_at,
		status="CREATED",
	)


@router.get("/{grievance_id}", response_model=GrievanceDetailsResponse)
async def get_grievance(grievance_id: str) -> GrievanceDetailsResponse:
	grievance = grievance_repository.get_by_id(grievance_id)
	if grievance is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	return GrievanceDetailsResponse(**grievance)


@router.get("", response_model=GrievanceListResponse)
async def list_grievances(
	status: str | None = Query(default=None),
	category: str | None = Query(default=None),
	priority: str | None = Query(default=None),
	department: str | None = Query(default=None),
	limit: int = Query(default=50, ge=1, le=200),
	offset: int = Query(default=0, ge=0),
) -> GrievanceListResponse:
	items = grievance_repository.list_grievances(
		status=status,
		category=category,
		priority=priority,
		department=department,
		limit=limit,
		offset=offset,
	)

	return GrievanceListResponse(
		count=len(items),
		items=[GrievanceListItem(**item) for item in items],
	)


@router.post("/{grievance_id}/ai-result", response_model=GrievanceAIResultResponse)
async def receive_ai_result(grievance_id: str, payload: GrievanceAIResultRequest) -> GrievanceAIResultResponse:
	updated = grievance_repository.update_ai_result(grievance_id, payload.model_dump())
	if updated is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	return GrievanceAIResultResponse(
		grievance_id=grievance_id,
		status=updated["status"],
		updated_at=datetime.now(timezone.utc).isoformat(),
	)


@router.patch("/{grievance_id}/status", response_model=GrievanceAIResultResponse)
async def update_grievance_status(
	grievance_id: str,
	payload: GrievanceStatusUpdateRequest,
) -> GrievanceAIResultResponse:
	updated = grievance_repository.update_status(
		grievance_id=grievance_id,
		status=payload.status,
		notes=payload.notes,
	)
	if updated is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	return GrievanceAIResultResponse(
		grievance_id=grievance_id,
		status=updated["status"],
		updated_at=datetime.now(timezone.utc).isoformat(),
	)


@router.post("/{grievance_id}/feedback", response_model=GrievanceFeedbackResponse)
async def submit_feedback(
	grievance_id: str,
	payload: GrievanceFeedbackRequest,
) -> GrievanceFeedbackResponse:
	updated = grievance_repository.add_feedback(
		grievance_id,
		rating=payload.rating,
		comment=payload.comment,
		is_satisfied=payload.is_satisfied,
	)
	if updated is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	feedback = updated.get("latest_feedback") or {}
	return GrievanceFeedbackResponse(
		grievance_id=grievance_id,
		rating=payload.rating,
		submitted_at=str(feedback.get("submitted_at") or datetime.now(timezone.utc).isoformat()),
		message="Feedback submitted successfully",
	)


@router.post("/{grievance_id}/contest", response_model=GrievanceContestResponse)
async def contest_grievance(
	grievance_id: str,
	payload: GrievanceContestRequest,
) -> GrievanceContestResponse:
	audit_id = f"audit_{uuid4().hex[:8]}"
	audit_task_id = dispatch_task(
		"src.tasks.ai_processing.run_contestation_audit",
		grievance_id,
		payload.reason,
		payload.evidence_photo,
		audit_id,
	)

	updated = grievance_repository.mark_contested(
		grievance_id,
		reason=payload.reason,
		evidence_photo=payload.evidence_photo,
		audit_id=audit_id,
		audit_task_id=audit_task_id,
	)
	if updated is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	return GrievanceContestResponse(
		status=updated["status"],
		audit_triggered=True,
		audit_id=audit_id,
		audit_task_id=audit_task_id,
		message="Contestation received. AI audit initiated. You will be contacted within 24 hours.",
	)
