from __future__ import annotations

import asyncio

from redis.asyncio import Redis

from src.core.config import settings

_redis_client: Redis | None = None


def get_redis_client() -> Redis:
    global _redis_client
    if _redis_client is None:
        _redis_client = Redis.from_url(settings.redis_url, decode_responses=True)
    return _redis_client


def get_pubsub_redis_client() -> Redis:
    url = settings.redis_pubsub_url or settings.redis_url
    return Redis.from_url(url, decode_responses=True)


async def close_redis_client() -> None:
    global _redis_client
    if _redis_client is not None:
        close_fn = getattr(_redis_client, "aclose", None) or getattr(_redis_client, "close", None)
        if close_fn is not None:
            result = close_fn()
            if asyncio.iscoroutine(result):
                await result
        _redis_client = None
