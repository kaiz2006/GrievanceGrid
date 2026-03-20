from __future__ import annotations

import hashlib
import logging

from src.core.config import settings
from src.core.redis_client import get_redis_client

logger = logging.getLogger(__name__)


def _fingerprint(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _session_key(token: str, token_type: str) -> str:
    return f"{settings.session_prefix}:{token_type}:{_fingerprint(token)}"


async def store_token_session(token: str, user_id: str, token_type: str, ttl_seconds: int) -> bool:
    if ttl_seconds <= 0:
        return False

    key = _session_key(token, token_type)
    try:
        redis = get_redis_client()
        await redis.set(key, user_id, ex=ttl_seconds)
        return True
    except Exception as exc:
        logger.warning("Failed to store token session", extra={"error": str(exc), "token_type": token_type})
        return False


async def is_token_session_active(token: str, token_type: str) -> bool:
    key = _session_key(token, token_type)
    try:
        redis = get_redis_client()
        value = await redis.get(key)
        return value is not None
    except Exception as exc:
        logger.warning("Failed to read token session", extra={"error": str(exc), "token_type": token_type})
        # Fail-open when Redis is unavailable to avoid full auth outage.
        return True


async def revoke_token_session(token: str, token_type: str) -> bool:
    key = _session_key(token, token_type)
    try:
        redis = get_redis_client()
        deleted = await redis.delete(key)
        return bool(deleted)
    except Exception as exc:
        logger.warning("Failed to revoke token session", extra={"error": str(exc), "token_type": token_type})
        return False
