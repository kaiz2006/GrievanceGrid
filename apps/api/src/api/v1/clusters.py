from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

from src.core.worker import dispatch_task

router = APIRouter()


class ClusterRecomputeResponse(BaseModel):
	task_id: str
	scheduled_at: str


@router.post("/recluster", response_model=ClusterRecomputeResponse)
async def trigger_recluster() -> ClusterRecomputeResponse:
	task_id = dispatch_task("src.tasks.clustering.recluster_recent_grievances")
	return ClusterRecomputeResponse(
		task_id=task_id,
		scheduled_at=datetime.now(timezone.utc).isoformat(),
	)
