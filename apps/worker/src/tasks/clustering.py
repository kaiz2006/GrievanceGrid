from __future__ import annotations

import logging
from collections import Counter
from datetime import datetime, timezone
from typing import Any

from celery import shared_task

from src.config import settings

logger = logging.getLogger(__name__)


def _cluster_key(item: dict[str, Any], precision: int = 3) -> tuple[float, float] | None:
    lat = item.get("latitude")
    lng = item.get("longitude")
    if not isinstance(lat, (float, int)) or not isinstance(lng, (float, int)):
        return None
    return (round(float(lat), precision), round(float(lng), precision))


@shared_task(name="src.tasks.clustering.recluster_recent_grievances")
def recluster_recent_grievances(
    window_hours: int = 24,
    min_samples: int = 5,
    grievances: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Periodic clustering task for recent grievances.

    Fallback implementation clusters by rounded lat/lng bins when explicit
    grievance points are passed in. This keeps worker behavior deterministic
    before DBSCAN/LDA pipeline is fully wired.
    """
    grievances = grievances or []

    if settings.dry_run:
        logger.info("WORKER_DRY_RUN enabled, returning simulated clustering result")

    clustered_points: list[tuple[float, float]] = []
    for grievance in grievances:
        key = _cluster_key(grievance)
        if key is not None:
            clustered_points.append(key)

    histogram = Counter(clustered_points)
    significant_clusters = [k for k, count in histogram.items() if count >= min_samples]

    result = {
        "window_hours": window_hours,
        "min_samples": min_samples,
        "clusters_upserted": len(significant_clusters),
        "processed_grievances": len(grievances),
        "candidate_clusters": len(histogram),
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    logger.info("Recluster run complete", extra={"result": result})
    return result
