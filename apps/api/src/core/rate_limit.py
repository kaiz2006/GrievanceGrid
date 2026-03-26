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
            import asyncio
            redis = get_redis_client()
            # Use a strict 1-second timeout to avoid hanging the entire request
            current = await asyncio.wait_for(redis.incr(key), timeout=1.0)
            if current == 1:
                await asyncio.wait_for(redis.expire(key, window_seconds + 1), timeout=1.0)

            if current > settings.rate_limit_requests_per_window:
                retry_after = window_seconds
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Rate limit exceeded. Please try again shortly."},
                    headers={"Retry-After": str(retry_after)},
                )
        except (asyncio.TimeoutError, Exception) as exc:
            logger.warning(f"Rate limiter bypassed (Redis Error/Timeout): {exc}")

        return await call_next(request)
