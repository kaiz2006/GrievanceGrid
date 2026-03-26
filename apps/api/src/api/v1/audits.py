"""Audit endpoints for contestation review and validation."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.core.dependencies import get_current_user, require_admin, require_auditor
from src.repositories.grievances import GrievanceRepository
from src.repositories.operations import AuditLogRepository

router = APIRouter()


# =============================================================================
# AUDIT LIST ENDPOINT
# =============================================================================


class AuditListItem(BaseModel):
	audit_id: str
	grievance_id: str
	grid_id: str
	reason: str
	status: str
	risk_score: float | None = None
	created_at: str


class AuditListResponse(BaseModel):
	count: int
	audits: list[AuditListItem]


@router.get("", response_model=AuditListResponse)
async def list_audits(
	status: str | None = Query(default=None, description="Filter by status: PENDING, REVIEWED, APPROVED, REJECTED"),
	limit: int = Query(default=50, ge=1, le=200),
	offset: int = Query(default=0, ge=0),
	current_user: dict = Depends(require_auditor),
	db: AsyncSession = Depends(get_db_session),
) -> AuditListResponse:
	"""List all contestation audits (Admin/Auditor only)."""
	repo = GrievanceRepository(db)

	where_clause = "WHERE is_contested = true"
	params: dict[str, Any] = {"limit": limit, "offset": offset}

	if status:
		where_clause += " AND contest_audit_status = CAST(:status AS text)"
		params["status"] = status

	rows = await repo.fetch_all(
		f"""
		SELECT
			id, grid_id, contest_reason, contest_audit_status,
			contest_risk_score, contest_audit_id, created_at
		FROM grievances
		{where_clause}
		ORDER BY created_at DESC
		LIMIT :limit OFFSET :offset
		""",
		params,
	)

	audits = [
		AuditListItem(
			audit_id=str(row.get("contest_audit_id") or ""),
			grievance_id=str(row["id"]),
			grid_id=str(row["grid_id"]),
			reason=str(row.get("contest_reason") or ""),
			status=str(row.get("contest_audit_status") or "PENDING"),
			risk_score=float(row["contest_risk_score"]) if row.get("contest_risk_score") is not None else None,
			created_at=str(row["created_at"]),
		)
		for row in rows
	]

	return AuditListResponse(count=len(audits), audits=audits)


# =============================================================================
# AUDIT DETAIL ENDPOINT
# =============================================================================


class AuditDetailResponse(BaseModel):
	audit_id: str
	grievance_id: str
	grid_id: str
	title: str
	description: str
	reason: str
	evidence_photo_url: str | None = None
	status: str
	risk_score: float | None = None
	ai_recommendation: str | None = None
	ai_confidence: float | None = None
	validation_notes: str | None = None
	validated_by: str | None = None
	validated_at: str | None = None
	created_at: str
	updated_at: str | None = None


@router.get("/{audit_id}", response_model=AuditDetailResponse)
async def get_audit_detail(
	audit_id: str,
	current_user: dict = Depends(require_auditor),
	db: AsyncSession = Depends(get_db_session),
) -> AuditDetailResponse:
	"""Get detailed audit information by audit ID."""
	repo = GrievanceRepository(db)

	row = await repo.fetch_one(
		"""
		SELECT
			id, grid_id, title, description,
			contest_reason, contest_evidence_url, contest_audit_status,
			contest_risk_score, contest_audit_id,
			contest_ai_recommendation, contest_ai_confidence,
			contest_validation_notes, contest_validated_by, contest_validated_at,
			created_at, updated_at
		FROM grievances
		WHERE contest_audit_id = :audit_id
		""",
		{"audit_id": audit_id},
	)

	if row is None:
		raise HTTPException(status_code=404, detail="Audit not found")

	return AuditDetailResponse(
		audit_id=str(row.get("contest_audit_id") or audit_id),
		grievance_id=str(row["id"]),
		grid_id=str(row["grid_id"]),
		title=str(row["title"]),
		description=str(row["description"]),
		reason=str(row.get("contest_reason") or ""),
		evidence_photo_url=row.get("contest_evidence_url"),
		status=str(row.get("contest_audit_status") or "PENDING"),
		risk_score=float(row["contest_risk_score"]) if row.get("contest_risk_score") is not None else None,
		ai_recommendation=row.get("contest_ai_recommendation"),
		ai_confidence=float(row["contest_ai_confidence"]) if row.get("contest_ai_confidence") is not None else None,
		validation_notes=row.get("contest_validation_notes"),
		validated_by=row.get("contest_validated_by"),
		validated_at=str(row["contest_validated_at"]) if row.get("contest_validated_at") else None,
		created_at=str(row["created_at"]),
		updated_at=str(row["updated_at"]) if row.get("updated_at") else None,
	)


# =============================================================================
# AUDIT VALIDATION ENDPOINT
# =============================================================================


class AuditValidationRequest(BaseModel):
	action: str = Field(pattern="^(approve|reject)$", description="approve or reject the audit")
	notes: str | None = Field(default=None, max_length=2000, description="Validation notes")


class AuditValidationResponse(BaseModel):
	audit_id: str
	grievance_id: str
	action: str
	status: str
	validated_by: str
	validated_at: str
	message: str


@router.post("/{audit_id}/validate", response_model=AuditValidationResponse)
async def validate_audit(
	audit_id: str,
	payload: AuditValidationRequest,
	current_user: dict = Depends(require_auditor),
	db: AsyncSession = Depends(get_db_session),
) -> AuditValidationResponse:
	"""Validate (approve/reject) a contestation audit."""
	repo = GrievanceRepository(db)
	audit_repo = AuditLogRepository(db)

	# Fetch the grievance by audit_id
	grievance = await repo.fetch_one(
		"""
		SELECT id, grid_id, status, contest_audit_status
		FROM grievances
		WHERE contest_audit_id = :audit_id
		""",
		{"audit_id": audit_id},
	)

	if grievance is None:
		raise HTTPException(status_code=404, detail="Audit not found")

	if grievance.get("contest_audit_status") == "APPROVED":
		raise HTTPException(status_code=400, detail="Audit already approved")
	if grievance.get("contest_audit_status") == "REJECTED":
		raise HTTPException(status_code=400, detail="Audit already rejected")

	grievance_id = str(grievance["id"])
	new_status = "APPROVED" if payload.action == "approve" else "REJECTED"
	grievance_status = "IN_PROGRESS" if payload.action == "approve" else "RESOLVED"

	# Update grievance
	now = datetime.now(timezone.utc)
	await repo.execute(
		"""
		UPDATE grievances
		SET
			contest_audit_status = :audit_status,
			contest_validation_notes = :notes,
			contest_validated_by = :validator_id,
			contest_validated_at = :validated_at,
			status = :grievance_status,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = :grievance_id
		""",
		{
			"audit_status": new_status,
			"notes": payload.notes,
			"validator_id": current_user["id"],
			"validated_at": now,
			"grievance_status": grievance_status,
			"grievance_id": grievance_id,
		},
	)

	# Log the audit event
	await audit_repo.log_event(
		grievance_id=grievance_id,
		event_type="AUDITED",
		actor_id=current_user["id"],
		description=f"Audit {new_status.lower()}: {payload.notes or 'No notes provided'}",
		metadata={"audit_id": audit_id, "action": payload.action},
	)

	message = (
		"Audit approved. Grievance reopened for re-resolution."
		if payload.action == "approve"
		else "Audit rejected. Original resolution upheld."
	)

	return AuditValidationResponse(
		audit_id=audit_id,
		grievance_id=grievance_id,
		action=payload.action,
		status=new_status,
		validated_by=current_user["id"],
		validated_at=now.isoformat(),
		message=message,
	)


# =============================================================================
# AUDIT STATS ENDPOINT
# =============================================================================


class AuditStatsResponse(BaseModel):
	total_contested: int
	pending_review: int
	approved: int
	rejected: int
	approval_rate: float
	avg_risk_score: float | None = None


@router.get("/stats", response_model=AuditStatsResponse)
async def get_audit_stats(
	current_user: dict = Depends(require_auditor),
	db: AsyncSession = Depends(get_db_session),
) -> AuditStatsResponse:
	"""Get audit statistics."""
	repo = GrievanceRepository(db)

	stats = await repo.fetch_one(
		"""
		SELECT
			COUNT(*) as total_contested,
			COUNT(*) FILTER (WHERE contest_audit_status = 'PENDING' OR contest_audit_status IS NULL) as pending_review,
			COUNT(*) FILTER (WHERE contest_audit_status = 'APPROVED') as approved,
			COUNT(*) FILTER (WHERE contest_audit_status = 'REJECTED') as rejected,
			AVG(contest_risk_score) as avg_risk_score
		FROM grievances
		WHERE is_contested = true
		"""
	)

	total = stats.get("total_contested", 0) or 0
	approved = stats.get("approved", 0) or 0
	approval_rate = round(approved / total * 100, 1) if total > 0 else 0.0

	return AuditStatsResponse(
		total_contested=total,
		pending_review=stats.get("pending_review", 0) or 0,
		approved=approved,
		rejected=stats.get("rejected", 0) or 0,
		approval_rate=approval_rate,
		avg_risk_score=float(stats["avg_risk_score"]) if stats.get("avg_risk_score") is not None else None,
	)
