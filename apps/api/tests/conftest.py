from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, AsyncGenerator

import pytest
from fastapi.testclient import TestClient

API_ROOT = Path(__file__).resolve().parents[1]
if str(API_ROOT) not in sys.path:
    sys.path.insert(0, str(API_ROOT))

from src.core.database import get_db_session  # noqa: E402
from src.core.dependencies import get_current_user, require_admin  # noqa: E402
from src.main import app  # noqa: E402


class MockDB:
    """Stub object for database session."""

    pass


class RateLimitRedisStub:
    """Mock Redis client for rate limiting."""

    async def incr(self, key: str) -> int:
        return 1

    async def expire(self, key: str, ttl_seconds: int) -> bool:
        return True


class TrackingRedisStub:
    """Mock Redis client for tracking."""

    def __init__(self, payload: dict[str, Any] | None = None) -> None:
        self._payload = payload or {
            "latitude": 12.9716,
            "longitude": 77.5946,
            "updated_at": "2026-01-01T00:00:00Z",
        }

    async def get(self, key: str) -> str:
        return json.dumps(self._payload)

    async def hgetall(self, key: str) -> dict[str, str]:
        return {}


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch) -> TestClient:
    """FastAPI test client with mocked dependencies."""

    async def override_db() -> AsyncGenerator:
        yield MockDB()

    def override_current_user() -> dict[str, Any]:
        return {
            "id": "citizen-1",
            "email": "citizen@example.com",
            "name": "Citizen",
            "role": "CITIZEN",
            "is_active": True,
        }

    def override_admin_user() -> dict[str, Any]:
        return {
            "id": "admin-1",
            "email": "admin@example.com",
            "name": "Admin",
            "role": "ADMIN",
            "is_active": True,
        }

    app.dependency_overrides[get_db_session] = override_db
    app.dependency_overrides[get_current_user] = override_current_user
    app.dependency_overrides[require_admin] = override_admin_user

    monkeypatch.setattr("src.core.rate_limit.get_redis_client", lambda: RateLimitRedisStub())

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
