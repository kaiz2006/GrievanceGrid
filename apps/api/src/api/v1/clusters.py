from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.core.dependencies import require_admin
from src.core.worker import dispatch_task
from src.repositories.operations import ClusterRepository

router = APIRouter()


class ClusterRecomputeResponse(BaseModel):
	task_id: str
	scheduled_at: str


class ClusterItem(BaseModel):
	cluster_id: str
	cluster_type: str
	centroid_lat: float
	centroid_lng: float
	member_count: int
	crisis_score: float | None = None
	is_active: bool
	topics: list[str] | None = None
	metadata: dict | None = None


class ClusterListResponse(BaseModel):
	count: int
	clusters: list[ClusterItem]


@router.get("", response_model=ClusterListResponse)
async def list_clusters(
	cluster_type: str | None = Query(default=None),
	active: bool | None = Query(default=True),
	limit: int = Query(default=50, ge=1, le=200),
	db: AsyncSession = Depends(get_db_session),
) -> ClusterListResponse:
	repo = ClusterRepository(db)
	rows = await repo.list_clusters(cluster_type=cluster_type, is_active=active, limit=limit)
	items = [
		ClusterItem(
			cluster_id=str(row["id"]),
			cluster_type=str(row["cluster_type"]),
			centroid_lat=float(row["centroid_lat"]),
			centroid_lng=float(row["centroid_lng"]),
			member_count=int(row.get("member_count") or 0),
			crisis_score=float(row["crisis_score"]) if row.get("crisis_score") is not None else None,
			is_active=bool(row.get("is_active", True)),
			topics=row.get("topics") if isinstance(row.get("topics"), list) else None,
			metadata=row.get("metadata") if isinstance(row.get("metadata"), dict) else None,
		)
		for row in rows
	]
	return ClusterListResponse(count=len(items), clusters=items)


@router.post("/recluster", response_model=ClusterRecomputeResponse)
async def trigger_recluster() -> ClusterRecomputeResponse:
	task_id = dispatch_task("src.tasks.clustering.recluster_recent_grievances")
	return ClusterRecomputeResponse(
		task_id=task_id,
		scheduled_at=datetime.now(timezone.utc).isoformat(),
	)


# =============================================================================
# CLUSTER DETAIL ENDPOINT
# =============================================================================


class ClusterDetailResponse(BaseModel):
	cluster_id: str
	cluster_type: str
	centroid_lat: float
	centroid_lng: float
	member_count: int
	crisis_score: float | None = None
	is_active: bool
	topics: list[str] | None = None
	metadata: dict[str, Any] | None = None
	created_at: str | None = None
	updated_at: str | None = None


@router.get("/{cluster_id}", response_model=ClusterDetailResponse)
async def get_cluster_detail(
	cluster_id: str,
	admin_user: dict = Depends(require_admin),
	db: AsyncSession = Depends(get_db_session),
) -> ClusterDetailResponse:
	"""Get detailed information about a specific cluster."""
	repo = ClusterRepository(db)
	row = await repo.fetch_one(
		"""
		SELECT id, cluster_type, centroid_lat, centroid_lng, member_count,
		       crisis_score, is_active, topics, metadata, created_at, updated_at
		FROM geo_clusters
		WHERE id = :cluster_id
		""",
		{"cluster_id": cluster_id},
	)

	if row is None:
		raise HTTPException(status_code=404, detail="Cluster not found")

	return ClusterDetailResponse(
		cluster_id=str(row["id"]),
		cluster_type=str(row["cluster_type"]),
		centroid_lat=float(row["centroid_lat"]),
		centroid_lng=float(row["centroid_lng"]),
		member_count=int(row.get("member_count") or 0),
		crisis_score=float(row["crisis_score"]) if row.get("crisis_score") is not None else None,
		is_active=bool(row.get("is_active", True)),
		topics=row.get("topics") if isinstance(row.get("topics"), list) else None,
		metadata=row.get("metadata") if isinstance(row.get("metadata"), dict) else None,
		created_at=str(row["created_at"]) if row.get("created_at") else None,
		updated_at=str(row["updated_at"]) if row.get("updated_at") else None,
	)


# =============================================================================
# CLUSTER GRIEVANCES ENDPOINT
# =============================================================================


class ClusterGrievanceItem(BaseModel):
	grievance_id: str
	grid_id: str
	title: str
	category: str
	priority: str
	status: str
	similarity_score: float | None = None


class ClusterGrievancesResponse(BaseModel):
	cluster_id: str
	count: int
	grievances: list[ClusterGrievanceItem]


@router.get("/{cluster_id}/grievances", response_model=ClusterGrievancesResponse)
async def get_cluster_grievances(
	cluster_id: str,
	limit: int = Query(default=100, ge=1, le=500),
	admin_user: dict = Depends(require_admin),
	db: AsyncSession = Depends(get_db_session),
) -> ClusterGrievancesResponse:
	"""Get all grievances belonging to a cluster."""
	repo = ClusterRepository(db)

	# Verify cluster exists
	cluster = await repo.fetch_one(
		"SELECT id FROM geo_clusters WHERE id = :cluster_id",
		{"cluster_id": cluster_id},
	)
	if cluster is None:
		raise HTTPException(status_code=404, detail="Cluster not found")

	# Get cluster members
	rows = await repo.get_cluster_members(cluster_id, limit=limit)

	grievances = [
		ClusterGrievanceItem(
			grievance_id=str(row["grievance_id"]),
			grid_id=str(row["grid_id"]),
			title=str(row["title"]),
			category=str(row["category"]),
			priority=str(row["priority"]),
			status=str(row["status"]),
			similarity_score=float(row["similarity_score"]) if row.get("similarity_score") is not None else None,
		)
		for row in rows
	]

	return ClusterGrievancesResponse(
		cluster_id=cluster_id,
		count=len(grievances),
		grievances=grievances,
	)
