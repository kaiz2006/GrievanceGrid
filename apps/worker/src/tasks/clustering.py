import logging
from datetime import datetime, timezone
from typing import Any

from celery import shared_task

from src.config import settings
from src.ml_logic import geo_clustering, topic_analysis

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
    """Periodic clustering task for recent grievances using DBSCAN."""
    grievances = grievances or []

    # Run DBSCAN
    clusters = geo_clustering.detect_clusters(grievances)
    
    # Extract topics for each cluster if enough text exists
    for cluster in clusters:
        cluster_texts = []
        for g_id in cluster["grievance_ids"]:
            g_data = next((g for g in grievances if g.get("id") == g_id), {})
            text = g_data.get("description") or g_data.get("title") or ""
            if text: cluster_texts.append(text)
        
        if cluster_texts:
            cluster["topics"] = topic_analysis.extract_topics(cluster_texts)

    result = {
        "window_hours": window_hours,
        "min_samples": min_samples,
        "clusters_found": len(clusters),
        "clusters": clusters,
        "processed_grievances": len(grievances),
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    logger.info("Recluster run complete", extra={"result": result})
    return result
