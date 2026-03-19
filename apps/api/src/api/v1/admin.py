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
