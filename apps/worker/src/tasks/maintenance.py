from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from celery import shared_task

from src.config import settings
from src.utils import compute_failure_risk

logger = logging.getLogger(__name__)


@shared_task(name="src.tasks.maintenance.update_infrastructure_risk_scores")
def update_infrastructure_risk_scores(
    batch_size: int = 500,
    assets: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Update predictive maintenance risk score snapshots.

    When explicit assets are supplied, compute deterministic risk scores to
    provide a concrete baseline before model-backed scoring is integrated.
    """
    assets = assets or []

    if settings.dry_run:
        logger.info("WORKER_DRY_RUN enabled, returning simulated maintenance update")

    updated_assets: list[dict[str, Any]] = []
    high_risk = 0
    for asset in assets[:batch_size]:
        complaint_count = int(asset.get("complaint_count", 0) or 0)
        unresolved_count = int(asset.get("unresolved_count", 0) or 0)
        risk_score = compute_failure_risk(complaint_count=complaint_count, unresolved_count=unresolved_count)
        if risk_score >= 0.7:
            high_risk += 1

        updated_assets.append(
            {
                "asset_id": asset.get("asset_id", "unknown"),
                "failure_risk_score": risk_score,
            }
        )

    result = {
        "batch_size": batch_size,
        "assets_updated": len(updated_assets),
        "high_risk_assets": high_risk,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    logger.info("Maintenance update complete", extra={"result": result})
    return result
