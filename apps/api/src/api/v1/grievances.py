from __future__ import annotations

import math
from datetime import datetime, timezone
from typing import Any
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.core.worker import dispatch_task
from src.core.dependencies import get_current_user, optional_auth
from src.repositories.grievances import GrievanceRepository
from src.services.grievance_service import GrievanceService

router = APIRouter()


class GrievanceCreateRequest(BaseModel):
	citizen_id: str | None = None
	category: str | None = None
	priority: str | None = None
	title: str = Field(min_length=3, max_length=500)
	description: str = Field(min_length=5)
	latitude: float | None = None
	longitude: float | None = None
	location_address: str | None = None
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
	response_deadline: str
	resolution_deadline: str
	status: str


class GrievanceDetailsResponse(BaseModel):
	grievance_id: str
	grid_id: str
	status: str
	category: str
	priority: str
	title: str
	description: str
	citizen_id: str
	citizen_name: str | None = None
	citizen_phone: str | None = None
	latitude: float | None = None
	longitude: float | None = None
	location_address: str | None = None
	before_photo_url: str | None = None
	after_photo_url: str | None = None
	ai_category: str | None = None
	ai_priority: str | None = None
	ai_summary: str | None = None
	damage_severity: float | None = None
	assigned_department_id: str | None = None
	assigned_department_name: str | None = None
	assigned_team_id: str | None = None
	assigned_team_name: str | None = None
	submitted_at: str
	updated_at: str
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


class NotificationDeliveryResultRequest(BaseModel):
	model_config = ConfigDict(extra="allow")

	grievance_id: str | None = None
	status: str
	recipients: list[str] = Field(default_factory=list)
	delivered: int = 0
	failed: int = 0
	skipped: int = 0
	channels: dict[str, int] = Field(default_factory=dict)
	results: list[dict[str, Any]] = Field(default_factory=list)
	generated_at: str | None = None


class NotificationDeliveryResultResponse(BaseModel):
	grievance_id: str
	status: str
	updated_at: str


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
	category: str
	priority: str
	ai_category: str | None = None
	ai_priority: str | None = None
	assigned_department_id: str | None = None
	submitted_at: str


class GrievanceListResponse(BaseModel):
	count: int
	items: list[GrievanceListItem]


def _build_grid_id() -> str:
	year = datetime.now(timezone.utc).year
	suffix = uuid4().hex[:6].upper()
	return f"GRI-{year}-{suffix}"


def _to_iso(value: Any) -> str:
	return value.isoformat() if hasattr(value, "isoformat") else str(value)


@router.post("", response_model=GrievanceCreateResponse, status_code=201)
async def create_grievance(
	payload: GrievanceCreateRequest,
	current_user: dict = Depends(get_current_user),
	db: AsyncSession = Depends(get_db_session),
) -> GrievanceCreateResponse:
	repo = GrievanceRepository(db)
	grievance_id = str(uuid4())
	grid_id = _build_grid_id()

	task_id = dispatch_task(
		"src.tasks.ai_processing.process_grievance_ai",
		grievance_id,
		payload.model_dump(),
	)

	try:
		created = await repo.create(
			{
				"id": grievance_id,
				"grid_id": grid_id,
				"citizen_id": current_user["id"],  # Use authenticated user's ID
				"category": payload.category or payload.hint_category or "OTHER",
				"priority": payload.priority or payload.hint_priority or "MEDIUM",
				"title": payload.title,
				"description": payload.description,
				"latitude": payload.latitude,
				"longitude": payload.longitude,
				"location_address": payload.location_address or payload.location_text,
				"before_photo_url": payload.before_photo_url,
			}
		)
	except ValueError as exc:
		raise HTTPException(status_code=400, detail=str(exc)) from exc

	return GrievanceCreateResponse(
		grievance_id=str(created["id"]),
		grid_id=str(created["grid_id"]),
		processing_task_id=task_id,
		submitted_at=_to_iso(created.get("created_at")),
		response_deadline=_to_iso(created.get("response_deadline")),
		resolution_deadline=_to_iso(created.get("resolution_deadline")),
		status=str(created.get("status", "CREATED")),
	)


@router.get("/{grievance_id:uuid}", response_model=GrievanceDetailsResponse)
async def get_grievance(
	grievance_id: UUID,
	db: AsyncSession = Depends(get_db_session),
) -> GrievanceDetailsResponse:
	repo = GrievanceRepository(db)
	grievance = await repo.get_by_id(str(grievance_id))
	if grievance is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	timeline = await repo.get_timeline(str(grievance_id))
	return GrievanceDetailsResponse(
		grievance_id=str(grievance["id"]),
		grid_id=str(grievance["grid_id"]),
		status=str(grievance["status"]),
		category=str(grievance["category"]),
		priority=str(grievance["priority"]),
		title=str(grievance["title"]),
		description=str(grievance["description"]),
		citizen_id=str(grievance["citizen_id"]),
		citizen_name=grievance.get("citizen_name"),
		citizen_phone=grievance.get("citizen_phone"),
		latitude=float(grievance["latitude"]) if grievance.get("latitude") is not None else None,
		longitude=float(grievance["longitude"]) if grievance.get("longitude") is not None else None,
		location_address=grievance.get("location_address"),
		before_photo_url=grievance.get("before_photo_url"),
		after_photo_url=grievance.get("after_photo_url"),
		ai_category=str(grievance["ai_category"]) if grievance.get("ai_category") else None,
		ai_priority=str(grievance["ai_priority"]) if grievance.get("ai_priority") else None,
		ai_summary=grievance.get("ai_summary"),
		damage_severity=float(grievance["damage_severity"]) if grievance.get("damage_severity") is not None else None,
		assigned_department_id=str(grievance["assigned_department_id"]) if grievance.get("assigned_department_id") else None,
		assigned_department_name=grievance.get("assigned_department_name"),
		assigned_team_id=str(grievance["assigned_team_id"]) if grievance.get("assigned_team_id") else None,
		assigned_team_name=grievance.get("assigned_team_name"),
		submitted_at=_to_iso(grievance.get("created_at")),
		updated_at=_to_iso(grievance.get("updated_at")),
		timeline=[
			{
				"status": str(event.get("status") or "UPDATED"),
				"timestamp": _to_iso(event.get("timestamp")),
				"description": str(event.get("description") or "Status updated"),
				**({"metadata": event.get("metadata")} if event.get("metadata") else {}),
			}
			for event in timeline
		],
	)


@router.get("", response_model=GrievanceListResponse)
async def list_grievances(
	status: str | None = Query(default=None),
	category: str | None = Query(default=None),
	priority: str | None = Query(default=None),
	department: str | None = Query(default=None),
	department_id: str | None = Query(default=None),
	limit: int = Query(default=50, ge=1, le=200),
	offset: int = Query(default=0, ge=0),
	db: AsyncSession = Depends(get_db_session),
) -> GrievanceListResponse:
	repo = GrievanceRepository(db)
	items = await repo.list_grievances(
		status=status,
		category=category,
		priority=priority,
		department_id=department_id or department,
		limit=limit,
		offset=offset,
	)

	return GrievanceListResponse(
		count=len(items),
		items=[
			GrievanceListItem(
				grievance_id=str(item["id"]),
				grid_id=str(item["grid_id"]),
				status=str(item["status"]),
				title=str(item["title"]),
				category=str(item["category"]),
				priority=str(item["priority"]),
				ai_category=str(item["ai_category"]) if item.get("ai_category") else None,
				ai_priority=str(item["ai_priority"]) if item.get("ai_priority") else None,
				assigned_department_id=str(item["assigned_department_id"]) if item.get("assigned_department_id") else None,
				submitted_at=_to_iso(item.get("created_at")),
			)
			for item in items
		],
	)


@router.post("/{grievance_id:uuid}/ai-result", response_model=GrievanceAIResultResponse)
async def receive_ai_result(
	grievance_id: UUID,
	payload: GrievanceAIResultRequest,
	db: AsyncSession = Depends(get_db_session),
) -> GrievanceAIResultResponse:
	repo = GrievanceRepository(db)
	updated = await repo.update_ai_result(str(grievance_id), payload.model_dump())
	if updated is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	return GrievanceAIResultResponse(
		grievance_id=str(grievance_id),
		status=str(updated["status"]),
		updated_at=_to_iso(updated.get("updated_at")),
	)


@router.patch("/{grievance_id:uuid}/status", response_model=GrievanceAIResultResponse)
async def update_grievance_status(
	grievance_id: UUID,
	payload: GrievanceStatusUpdateRequest,
	current_user: dict = Depends(get_current_user),
	db: AsyncSession = Depends(get_db_session),
) -> GrievanceAIResultResponse:
	service = GrievanceService(db)
	try:
		updated = await service.update_status(
			grievance_id=str(grievance_id),
			new_status=payload.status,
			notes=payload.notes,
		)
	except ValueError as exc:
		raise HTTPException(status_code=400, detail=str(exc)) from exc
	if updated is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	return GrievanceAIResultResponse(
		grievance_id=str(grievance_id),
		status=str(updated["status"]),
		updated_at=_to_iso(updated.get("updated_at")),
	)


@router.post("/{grievance_id:uuid}/notification-result", response_model=NotificationDeliveryResultResponse)
async def receive_notification_delivery_result(
	grievance_id: UUID,
	payload: NotificationDeliveryResultRequest,
	db: AsyncSession = Depends(get_db_session),
) -> NotificationDeliveryResultResponse:
	repo = GrievanceRepository(db)
	stored = await repo.persist_notification_delivery(
		grievance_id=str(grievance_id),
		status=payload.status,
		delivery_report=payload.model_dump(),
	)
	if stored is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	return NotificationDeliveryResultResponse(
		grievance_id=str(grievance_id),
		status=payload.status,
		updated_at=_to_iso(stored.get("updated_at") or datetime.now(timezone.utc)),
	)


@router.post("/{grievance_id:uuid}/feedback", response_model=GrievanceFeedbackResponse)
async def submit_feedback(
	grievance_id: UUID,
	payload: GrievanceFeedbackRequest,
	current_user: dict = Depends(get_current_user),
	db: AsyncSession = Depends(get_db_session),
) -> GrievanceFeedbackResponse:
	repo = GrievanceRepository(db)
	updated = await repo.add_feedback(
		str(grievance_id),
		rating=payload.rating,
		comment=payload.comment,
		is_satisfied=payload.is_satisfied,
	)
	if updated is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	return GrievanceFeedbackResponse(
		grievance_id=str(grievance_id),
		rating=payload.rating,
		submitted_at=_to_iso(updated.get("updated_at")),
		message="Feedback submitted successfully",
	)


@router.post("/{grievance_id:uuid}/contest", response_model=GrievanceContestResponse)
async def contest_grievance(
	grievance_id: UUID,
	payload: GrievanceContestRequest,
	current_user: dict = Depends(get_current_user),
	db: AsyncSession = Depends(get_db_session),
) -> GrievanceContestResponse:
	repo = GrievanceRepository(db)
	audit_id = f"audit_{uuid4().hex[:8]}"
	audit_task_id = dispatch_task(
		"src.tasks.ai_processing.run_contestation_audit",
		str(grievance_id),
		payload.reason,
		payload.evidence_photo,
		audit_id,
	)

	updated = await repo.mark_contested(
		str(grievance_id),
		reason=payload.reason,
		evidence_photo=payload.evidence_photo,
		audit_id=audit_id,
		audit_task_id=audit_task_id,
	)
	if updated is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	return GrievanceContestResponse(
		status=str(updated["status"]),
		audit_triggered=True,
		audit_id=audit_id,
		audit_task_id=audit_task_id,
		message="Contestation received. AI audit initiated. You will be contacted within 24 hours.",
	)


# =============================================================================
# MY GRIEVANCES ENDPOINT
# =============================================================================

class MyGrievanceItem(BaseModel):
	id: str
	grid_id: str
	title: str
	category: str
	status: str
	priority: str
	description: str
	location_address: str | None = None
	created_at: str
	resolved_at: str | None = None
	can_feedback: bool
	can_contest: bool


class MyGrievancesResponse(BaseModel):
	count: int
	items: list[MyGrievanceItem]


@router.get("/me", response_model=MyGrievancesResponse)
async def get_my_grievances(
	limit: int = Query(default=20, ge=1, le=100),
	offset: int = Query(default=0, ge=0),
	current_user: dict = Depends(get_current_user),
	db: AsyncSession = Depends(get_db_session),
) -> MyGrievancesResponse:
	"""Get grievances submitted by the current user."""
	repo = GrievanceRepository(db)
	rows = await repo.list_grievances_by_citizen(
		citizen_id=current_user["id"],
		limit=limit,
		offset=offset,
	)

	items = []
	for row in rows:
		status = str(row["status"])
		can_feedback = status == "RESOLVED"
		can_contest = status in ("RESOLVED", "CONTESTED")

		items.append(
			MyGrievanceItem(
				id=str(row["id"]),
				grid_id=str(row["grid_id"]),
				title=str(row["title"]),
				category=str(row["category"]),
				status=status,
				priority=str(row["priority"]),
				description=str(row["description"]),
				location_address=row.get("location_address"),
				created_at=_to_iso(row["created_at"]),
				resolved_at=_to_iso(row["resolved_at"]) if row.get("resolved_at") else None,
				can_feedback=can_feedback,
				can_contest=can_contest,
			)
		)

	return MyGrievancesResponse(count=len(items), items=items)


# =============================================================================
# SIMILAR CASES ENDPOINT
# =============================================================================

class SimilarCaseItem(BaseModel):
	grid_id: str
	title: str
	similarity_score: float
	resolution_summary: str | None = None
	resolution_time_hours: float | None = None
	department: str | None = None


class SimilarCasesResponse(BaseModel):
	count: int
	cases: list[SimilarCaseItem]


@router.get("/{grievance_id:uuid}/similar", response_model=SimilarCasesResponse)
async def get_similar_cases(
	grievance_id: UUID,
	limit: int = Query(default=5, ge=1, le=20),
	current_user: dict = Depends(get_current_user),
	db: AsyncSession = Depends(get_db_session),
) -> SimilarCasesResponse:
	"""Find similar grievances using vector similarity search."""
	repo = GrievanceRepository(db)
	grievance_id_str = str(grievance_id)
	grievance = await repo.get_by_id(grievance_id_str)
	if grievance is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	# Get embedding from grievance if available
	embedding = grievance.get("embedding")
	if not embedding:
		# Return empty if no embedding exists yet
		return SimilarCasesResponse(count=0, cases=[])

	# Query Qdrant for similar vectors
	try:
		from src.services.vector_service import VectorService
		vector_service = VectorService()
		similar = await vector_service.find_similar(
			embedding=embedding,
			category=grievance.get("category"),
			limit=limit + 1,  # +1 to exclude self
		)
	except Exception:
		# Fallback: search by category in DB
		similar = []

	cases = []
	for hit in similar:
		# Skip the same grievance
		if hit.get("id") == grievance_id_str:
			continue

		cases.append(
			SimilarCaseItem(
				grid_id=hit.get("grid_id", ""),
				title=hit.get("title", "Unknown"),
				similarity_score=hit.get("score", 0.0),
				resolution_summary=hit.get("resolution_summary"),
				resolution_time_hours=hit.get("resolution_time_hours"),
				department=hit.get("department"),
			)
		)

		if len(cases) >= limit:
			break

	return SimilarCasesResponse(count=len(cases), cases=cases)
