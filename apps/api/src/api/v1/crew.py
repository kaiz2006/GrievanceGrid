"""Crew/Field Team API endpoints for handling assignments and operational tasks."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.core.dependencies import get_current_user
from src.repositories.grievances import GrievanceRepository

router = APIRouter()


# =============================================================================
# MODELS
# =============================================================================

class CrewMemberInfo(BaseModel):
	id: str
	name: str
	email: str
	team_id: str
	team_name: str | None = None
	role: str


class AssignmentItem(BaseModel):
	grievance_id: str
	grid_id: str
	title: str
	description: str
	category: str
	priority: str
	location_address: str | None = None
	latitude: float | None = None
	longitude: float | None = None
	status: str
	citizen_name: str | None = None
	citizen_phone: str | None = None
	ai_summary: str | None = None
	damage_severity: float | None = None
	assigned_team_id: str
	assigned_team_name: str | None = None
	created_at: str
	updated_at: str


class CrewAssignmentsResponse(BaseModel):
	count: int
	items: list[AssignmentItem]


class CrewProfileResponse(BaseModel):
	member: CrewMemberInfo
	team_assignments_count: int
	active_assignments_count: int


class AssignmentStatusUpdateRequest(BaseModel):
	status: str = Field(min_length=2, max_length=64)
	notes: str | None = Field(default=None, max_length=500)


class AssignmentStatusUpdateResponse(BaseModel):
	grievance_id: str
	grid_id: str
	status: str
	updated_at: str
	message: str


# =============================================================================
# ENDPOINTS
# =============================================================================

@router.get("/me", response_model=CrewProfileResponse)
async def get_my_profile(
	current_user: dict = Depends(get_current_user),
	db: AsyncSession = Depends(get_db_session),
) -> CrewProfileResponse:
	"""Get current crew member's profile and stats."""
	repo = GrievanceRepository(db)
	
	# Fetch crew member info
	member_data = await repo.fetch_one(
		"""
		SELECT
			u.id,
			u.name,
			u.email,
			t.id AS team_id,
			t.name AS team_name,
			u.role
		FROM users u
		LEFT JOIN teams t ON u.team_id = t.id
		WHERE u.id = :user_id
		""",
		{"user_id": current_user.get("id")},
	)

	if not member_data:
		raise HTTPException(status_code=404, detail="Crew member not found")

	# Count assignments
	total_count = await repo.fetch_scalar(
		"""
		SELECT COUNT(*) FROM grievances
		WHERE assigned_team_id = :team_id
		""",
		{"team_id": member_data.get("team_id")},
	)

	active_count = await repo.fetch_scalar(
		"""
		SELECT COUNT(*) FROM grievances
		WHERE assigned_team_id = :team_id
		AND status NOT IN ('RESOLVED', 'CLOSED', 'CONTESTED')
		""",
		{"team_id": member_data.get("team_id")},
	)

	return CrewProfileResponse(
		member=CrewMemberInfo(
			id=str(member_data["id"]),
			name=str(member_data["name"]),
			email=str(member_data["email"]),
			team_id=str(member_data["team_id"]) if member_data.get("team_id") else "",
			team_name=member_data.get("team_name"),
			role=str(member_data["role"]),
		),
		team_assignments_count=int(total_count) if total_count else 0,
		active_assignments_count=int(active_count) if active_count else 0,
	)


@router.get("/assignments", response_model=CrewAssignmentsResponse)
async def get_team_assignments(
	status: str | None = Query(default=None, description="Filter by status"),
	limit: int = Query(default=50, ge=1, le=200),
	offset: int = Query(default=0, ge=0),
	current_user: dict = Depends(get_current_user),
	db: AsyncSession = Depends(get_db_session),
) -> CrewAssignmentsResponse:
	"""Get all grievances assigned to the current crew member's team."""
	repo = GrievanceRepository(db)
	
	# Get user's team
	team_info = await repo.fetch_one(
		"SELECT team_id FROM users WHERE id = :user_id",
		{"user_id": current_user.get("id")},
	)

	if not team_info or not team_info.get("team_id"):
		return CrewAssignmentsResponse(count=0, items=[])

	team_id = team_info.get("team_id")

	# Build query
	where_clause = "WHERE g.assigned_team_id = :team_id"
	params: dict = {"team_id": team_id, "limit": limit, "offset": offset}

	if status:
		where_clause += " AND g.status = CAST(:status AS grievance_status)"
		params["status"] = status

	items = await repo.fetch_all(
		f"""
		SELECT
			g.id,
			g.grid_id,
			g.title,
			g.description,
			g.category,
			g.priority,
			g.location_address,
			g.latitude,
			g.longitude,
			g.status,
			u.name AS citizen_name,
			u.phone AS citizen_phone,
			g.ai_summary,
			g.damage_severity,
			g.assigned_team_id,
			t.name AS assigned_team_name,
			g.created_at,
			g.updated_at
		FROM grievances g
		LEFT JOIN users u ON u.id = g.citizen_id
		LEFT JOIN teams t ON t.id = g.assigned_team_id
		{where_clause}
		ORDER BY g.created_at DESC, CAST(g.priority AS priority) DESC
		LIMIT :limit OFFSET :offset
		""",
		params,
	)

	return CrewAssignmentsResponse(
		count=len(items),
		items=[
			AssignmentItem(
				grievance_id=str(item["id"]),
				grid_id=str(item["grid_id"]),
				title=str(item["title"]),
				description=str(item["description"]),
				category=str(item["category"]),
				priority=str(item["priority"]),
				location_address=item.get("location_address"),
				latitude=float(item["latitude"]) if item.get("latitude") is not None else None,
				longitude=float(item["longitude"]) if item.get("longitude") is not None else None,
				status=str(item["status"]),
				citizen_name=item.get("citizen_name"),
				citizen_phone=item.get("citizen_phone"),
				ai_summary=item.get("ai_summary"),
				damage_severity=float(item["damage_severity"]) if item.get("damage_severity") is not None else None,
				assigned_team_id=str(item["assigned_team_id"]) if item.get("assigned_team_id") else "",
				assigned_team_name=item.get("assigned_team_name"),
				created_at=str(item["created_at"]),
				updated_at=str(item["updated_at"]),
			)
			for item in items
		],
	)


@router.patch("/assignments/{grievance_id}/status", response_model=AssignmentStatusUpdateResponse)
async def update_assignment_status(
	grievance_id: str,
	payload: AssignmentStatusUpdateRequest,
	current_user: dict = Depends(get_current_user),
	db: AsyncSession = Depends(get_db_session),
) -> AssignmentStatusUpdateResponse:
	"""Update status of an assignment (e.g., mark as IN_PROGRESS, RESOLVED, etc)."""
	from src.services.grievance_service import GrievanceService

	repo = GrievanceRepository(db)
	grievance = await repo.get_by_id(grievance_id)

	if grievance is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	# Verify crew is assigned to this grievance
	user_team = await repo.fetch_scalar(
		"SELECT team_id FROM users WHERE id = :user_id",
		{"user_id": current_user.get("id")},
	)

	if str(grievance.get("assigned_team_id")) != str(user_team):
		raise HTTPException(status_code=403, detail="You are not assigned to this grievance")

	service = GrievanceService(db)

	try:
		updated = await service.update_status(
			grievance_id=grievance_id,
			new_status=payload.status,
			notes=payload.notes,
		)
	except ValueError as exc:
		raise HTTPException(status_code=400, detail=str(exc)) from exc

	if updated is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	return AssignmentStatusUpdateResponse(
		grievance_id=grievance_id,
		grid_id=str(updated["grid_id"]),
		status=str(updated["status"]),
		updated_at=str(updated["updated_at"]),
		message=f"Assignment status updated to {payload.status}",
	)


@router.get("/{grievance_id}", response_model=AssignmentItem)
async def get_assignment_detail(
	grievance_id: str,
	current_user: dict = Depends(get_current_user),
	db: AsyncSession = Depends(get_db_session),
) -> AssignmentItem:
	"""Get full details of an assigned grievance."""
	repo = GrievanceRepository(db)
	grievance = await repo.get_by_id(grievance_id)

	if grievance is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	# Verify crew member is assigned to this grievance
	user_team = await repo.fetch_scalar(
		"SELECT team_id FROM users WHERE id = :user_id",
		{"user_id": current_user.get("id")},
	)

	if str(grievance.get("assigned_team_id")) != str(user_team):
		raise HTTPException(status_code=403, detail="You are not assigned to this grievance")

	return AssignmentItem(
		grievance_id=str(grievance["id"]),
		grid_id=str(grievance["grid_id"]),
		title=str(grievance["title"]),
		description=str(grievance["description"]),
		category=str(grievance["category"]),
		priority=str(grievance["priority"]),
		location_address=grievance.get("location_address"),
		latitude=float(grievance["latitude"]) if grievance.get("latitude") is not None else None,
		longitude=float(grievance["longitude"]) if grievance.get("longitude") is not None else None,
		status=str(grievance["status"]),
		citizen_name=grievance.get("citizen_name"),
		citizen_phone=grievance.get("citizen_phone"),
		ai_summary=grievance.get("ai_summary"),
		damage_severity=float(grievance["damage_severity"]) if grievance.get("damage_severity") is not None else None,
		assigned_team_id=str(grievance["assigned_team_id"]) if grievance.get("assigned_team_id") else "",
		assigned_team_name=grievance.get("assigned_team_name"),
		created_at=str(grievance["created_at"]),
		updated_at=str(grievance["updated_at"]),
	)
