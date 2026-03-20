from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from celery import shared_task

from src.config import settings
from src.utils.risk import compute_failure_risk
from src.clients.backend_client import BackendClient

logger = logging.getLogger(__name__)


@shared_task(name="src.tasks.maintenance.update_infrastructure_risk_scores")
def update_infrastructure_risk_scores(
    batch_size: int = 500,
    assets: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Update predictive maintenance risk score snapshots.

    Automated workflow:
    1. Fetch all active assets from backend if None provided.
    2. Calculate risk scores for the batch.
    3. Post results back to backend in one batch.
    """
    backend = BackendClient()
    if assets is None:
        logger.info("Fetching assets from backend for risk update")
        assets = backend.get_infrastructure_assets()

    if not assets:
        logger.info("No infrastructure assets found for update")
        return {"status": "skipped", "reason": "no assets"}

    if settings.dry_run:
        logger.info("WORKER_DRY_RUN enabled, returning simulated maintenance update")

    updated_assets_for_post: list[dict[str, Any]] = []
    high_risk = 0
    for asset in assets[:batch_size]:
        complaint_count = int(asset.get("complaint_count_7d") or asset.get("complaint_count", 0) or 0)
        unresolved_count = int(asset.get("unresolved_count", 0) or 0)
        risk_score = compute_failure_risk(complaint_count=complaint_count, unresolved_count=unresolved_count)

        if risk_score >= 0.7:
            high_risk += 1

        updated_assets_for_post.append(
            {
                "asset_id": asset.get("id") or asset.get("asset_id", "unknown"),
                "failure_risk_score": risk_score,
            }
        )

    # Post back to backend
    success = backend.post_infrastructure_risk_update(updated_assets_for_post)

    result = {
        "batch_size": batch_size,
        "assets_processed": len(updated_assets_for_post),
        "high_risk_assets": high_risk,
        "backend_updated": success,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    logger.info("Maintenance update complete", extra={"result": result})
    return result
