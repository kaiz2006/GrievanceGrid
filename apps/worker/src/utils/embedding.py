from __future__ import annotations

import hashlib


def deterministic_embedding(text: str, dimension: int) -> list[float]:
    """Build a deterministic fallback embedding when embedding service is unavailable."""
    if dimension <= 0:
        return []

    seed = hashlib.sha256(text.encode("utf-8")).digest()
    values: list[float] = []
    for i in range(dimension):
        byte_value = seed[i % len(seed)]
        values.append((byte_value / 127.5) - 1.0)
    return values