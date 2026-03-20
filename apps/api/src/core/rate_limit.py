from __future__ import annotations

import logging
import time

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from src.core.config import settings
from src.core.redis_client import get_redis_client

logger = logging.getLogger(__name__)


class RedisRateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client = request.client
        ip = client.host if client else None

        if not ip or request.url.path == "/health":
            return await call_next(request)

        window_seconds = max(1, settings.rate_limit_window_seconds)
        window_bucket = int(time.time() // window_seconds)
        key = f"{settings.rate_limit_prefix}:{ip}:{window_bucket}"

        try:
            redis = get_redis_client()
            current = await redis.incr(key)
            if current == 1:
                await redis.expire(key, window_seconds + 1)

            if current > settings.rate_limit_requests_per_window:
                retry_after = window_seconds
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Rate limit exceeded. Please try again shortly."},
                    headers={"Retry-After": str(retry_after)},
                )
        except Exception as exc:
            logger.warning("Rate limiter bypassed due to Redis error", extra={"error": str(exc)})

        return await call_next(request)
