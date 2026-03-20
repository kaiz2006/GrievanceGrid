from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from celery import shared_task

from src.config import settings
from src.ml_logic import maintenance_engine
from src.clients.backend_client import BackendClient

logger = logging.getLogger(__name__)


@shared_task(name="src.tasks.maintenance.update_infrastructure_risk_scores")
def update_infrastructure_risk_scores(
    batch_size: int = 500,
    assets: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Update predictive maintenance risk score snapshots using RandomForest Engine."""
    backend = BackendClient()
    if assets is None:
        logger.info("Fetching assets from backend for risk update")
        assets = backend.get_infrastructure_assets()

    if not assets:
        logger.info("No infrastructure assets found for update")
        return {"status": "skipped", "reason": "no assets"}

    updated_assets_for_post: list[dict[str, Any]] = []
    high_risk = 0
    for asset in assets[:batch_size]:
        # Use the advanced engine instead of a simple heuristic
        prediction = maintenance_engine.predict_failure(asset)
        risk_score = prediction["failure_probability"]

        if risk_score >= 0.7:
            high_risk += 1

        updated_assets_for_post.append(
            {
                "asset_id": asset.get("id") or asset.get("asset_id", "unknown"),
                "failure_risk_score": risk_score,
                "predicted_failure_date": prediction.get("predicted_failure_date"),
                "risk_factors": prediction.get("factors", []),
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
