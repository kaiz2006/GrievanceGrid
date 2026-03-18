from __future__ import annotations


def compute_failure_risk(complaint_count: int, unresolved_count: int) -> float:
    """Simple deterministic risk score in [0, 1] used as baseline fallback."""
    score = (complaint_count / 50.0) + (unresolved_count / 20.0)
    if score < 0:
        return 0.0
    if score > 1:
        return 1.0
    return round(score, 4)