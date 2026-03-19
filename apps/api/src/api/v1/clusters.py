from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
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
