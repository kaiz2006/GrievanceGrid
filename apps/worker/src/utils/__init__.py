"""Utility helpers for worker tasks."""

from src.utils.embedding import deterministic_embedding
from src.utils.risk import compute_failure_risk

__all__ = ["deterministic_embedding", "compute_failure_risk"]