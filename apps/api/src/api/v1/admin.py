from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.core.dependencies import require_admin
from src.repositories.grievances import GrievanceRepository
from src.repositories.operations import AuditLogRepository
from src.repositories.slas import SLARepository

router = APIRouter()


class AdminEscalationItem(BaseModel):
	grievance_id: str
	grid_id: str
	title: str
	status: str
	priority: str
	assigned_department_id: str | None = None
	created_at: str


class AdminEscalationResponse(BaseModel):
	count: int
	items: list[AdminEscalationItem]


class SLABreachItem(BaseModel):
	sla_id: str
	grievance_id: str
	grid_id: str
	sla_type: str
	deadline_at: str
	escalation_level: int
	title: str
	priority: str
	status: str
	location_address: str | None = None


class SLABreachResponse(BaseModel):
	count: int
	items: list[SLABreachItem]


class AuditEventItem(BaseModel):
	id: str
	event_type: str
	old_status: str | None = None
	new_status: str | None = None
	description: str | None = None
	actor_name: str | None = None
	created_at: str


class AuditHistoryResponse(BaseModel):
	grievance_id: str
	count: int
	events: list[AuditEventItem]


class AssignDepartmentRequest(BaseModel):
	department_id: str = Field(min_length=1)


@router.get("/escalations", response_model=AdminEscalationResponse)
async def list_escalations(
	limit: int = Query(default=100, ge=1, le=300),
	admin_user: dict = Depends(require_admin),
	db: AsyncSession = Depends(get_db_session),
) -> AdminEscalationResponse:
	grievance_repo = GrievanceRepository(db)
	escalated = await grievance_repo.list_grievances(status="ESCALATED", limit=limit, offset=0)
	contested = await grievance_repo.list_grievances(status="CONTESTED", limit=limit, offset=0)
	merged = escalated + contested

	# Deduplicate by grievance id while preserving order.
	seen: set[str] = set()
	items: list[AdminEscalationItem] = []
	for row in merged:
		grievance_id = str(row["id"])
		if grievance_id in seen:
			continue
		seen.add(grievance_id)
		items.append(
			AdminEscalationItem(
				grievance_id=grievance_id,
				grid_id=str(row["grid_id"]),
				title=str(row["title"]),
				status=str(row["status"]),
				priority=str(row["priority"]),
				assigned_department_id=str(row["assigned_department_id"]) if row.get("assigned_department_id") else None,
				created_at=str(row["created_at"]),
			)
		)

	return AdminEscalationResponse(count=len(items), items=items[:limit])


@router.get("/sla-breaches", response_model=SLABreachResponse)
async def list_sla_breaches(
	department_id: str | None = Query(default=None),
	limit: int = Query(default=100, ge=1, le=300),
	admin_user: dict = Depends(require_admin),
	db: AsyncSession = Depends(get_db_session),
) -> SLABreachResponse:
	sla_repo = SLARepository(db)
	rows = await sla_repo.get_breached_slas(department_id=department_id, limit=limit)
	items = [
		SLABreachItem(
			sla_id=str(row["id"]),
			grievance_id=str(row["grievance_id"]),
			grid_id=str(row["grid_id"]),
			sla_type=str(row["sla_type"]),
			deadline_at=str(row["deadline_at"]),
			escalation_level=int(row.get("escalation_level") or 0),
			title=str(row["title"]),
			priority=str(row["priority"]),
			status=str(row["status"]),
			location_address=row.get("location_address"),
		)
		for row in rows
	]
	return SLABreachResponse(count=len(items), items=items)


@router.get("/grievances/{grievance_id}/audit", response_model=AuditHistoryResponse)
async def get_grievance_audit_history(
	grievance_id: str,
	admin_user: dict = Depends(require_admin),
	db: AsyncSession = Depends(get_db_session),
) -> AuditHistoryResponse:
	audit_repo = AuditLogRepository(db)
	events = await audit_repo.get_grievance_history(grievance_id)
	return AuditHistoryResponse(
		grievance_id=grievance_id,
		count=len(events),
		events=[
			AuditEventItem(
				id=str(event["id"]),
				event_type=str(event["event_type"]),
				old_status=str(event["old_status"]) if event.get("old_status") else None,
				new_status=str(event["new_status"]) if event.get("new_status") else None,
				description=event.get("description"),
				actor_name=event.get("actor_name"),
				created_at=str(event["created_at"]),
			)
			for event in events
		],
	)


@router.patch("/grievances/{grievance_id}/assign-department")
async def assign_department(
	grievance_id: str,
	payload: AssignDepartmentRequest,
	admin_user: dict = Depends(require_admin),
	db: AsyncSession = Depends(get_db_session),
) -> dict[str, str]:
	grievance_repo = GrievanceRepository(db)
	updated = await grievance_repo.assign_department(grievance_id, payload.department_id)
	if updated is None:
		raise HTTPException(status_code=404, detail="Grievance not found")
	return {
		"grievance_id": grievance_id,
		"status": str(updated["status"]),
		"department_id": str(updated["assigned_department_id"]),
	}


# =============================================================================
# DEPARTMENTS ENDPOINTS
# =============================================================================


class DepartmentItem(BaseModel):
	id: str
	name: str
	code: str


class DepartmentListResponse(BaseModel):
	count: int
	items: list[DepartmentItem]


@router.get("/departments", response_model=DepartmentListResponse)
async def list_departments(
	admin_user: dict = Depends(require_admin),
	db: AsyncSession = Depends(get_db_session),
) -> DepartmentListResponse:
	"""Get all departments."""
	rows = await GrievanceRepository(db).fetch_all(
		"""
		SELECT id, name, code FROM departments ORDER BY name
		"""
	)
	items = [
		DepartmentItem(
			id=str(row["id"]),
			name=str(row["name"]),
			code=str(row["code"]),
		)
		for row in rows
	]
	return DepartmentListResponse(count=len(items), items=items)


# =============================================================================
# TEAMS ENDPOINTS
# =============================================================================


class TeamItem(BaseModel):
	id: str
	name: str
	department_id: str | None = None
	status: str = "available"
	current_location: dict[str, float] | None = None


class TeamListResponse(BaseModel):
	count: int
	items: list[TeamItem]


@router.get("/teams", response_model=TeamListResponse)
async def list_teams(
	department_id: str | None = Query(default=None),
	admin_user: dict = Depends(require_admin),
	db: AsyncSession = Depends(get_db_session),
) -> TeamListResponse:
	"""Get all field teams."""
	where_clause = "WHERE department_id = :department_id" if department_id else ""
	params = {"department_id": department_id} if department_id else {}

	rows = await GrievanceRepository(db).fetch_all(
		f"""
		SELECT id, name, department_id, status FROM teams
		{where_clause}
		ORDER BY name
		""",
		params,
	)

	items = [
		TeamItem(
			id=str(row["id"]),
			name=str(row["name"]),
			department_id=str(row["department_id"]) if row.get("department_id") else None,
			status=str(row.get("status", "available")),
		)
		for row in rows
	]
	return TeamListResponse(count=len(items), items=items)


# =============================================================================
# ASSIGN TEAM ENDPOINT
# =============================================================================


class AssignTeamRequest(BaseModel):
	team_id: str = Field(min_length=1)


class AssignTeamResponse(BaseModel):
	grievance_id: str
	team_id: str
	status: str
	eta_minutes: int | None = None


@router.post("/grievances/{grievance_id}/assign-team", response_model=AssignTeamResponse)
async def assign_team(
	grievance_id: str,
	payload: AssignTeamRequest,
	admin_user: dict = Depends(require_admin),
	db: AsyncSession = Depends(get_db_session),
) -> AssignTeamResponse:
	"""Assign a field team to a grievance."""
	repo = GrievanceRepository(db)

	# Update grievance with team assignment
	updated = await repo.update(
		"""
		UPDATE grievances
		SET assigned_team_id = :team_id, updated_at = CURRENT_TIMESTAMP
		WHERE id = :grievance_id
		RETURNING id, status, assigned_team_id
		""",
		{"grievance_id": grievance_id, "team_id": payload.team_id},
	)

	if updated is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	# Calculate ETA based on team location (simplified)
	eta_minutes = 15  # Default ETA

	return AssignTeamResponse(
		grievance_id=grievance_id,
		team_id=payload.team_id,
		status=str(updated["status"]),
		eta_minutes=eta_minutes,
	)
