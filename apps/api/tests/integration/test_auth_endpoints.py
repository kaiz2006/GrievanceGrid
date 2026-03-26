from __future__ import annotations

from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock

import pytest

from src.repositories.users import UserRepository
from src.core.auth import create_refresh_token


@pytest.mark.asyncio
def test_register_returns_tokens(client, monkeypatch: pytest.MonkeyPatch) -> None:
    """Test successful user registration."""
    user_mock = {
        "id": "user-1",
        "email": "new.user@example.com",
        "name": "New User",
        "role": "CITIZEN",
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
    }

    async def fake_user_exists(*args, **kwargs) -> bool:
        return False

    async def fake_create_user(*args, **kwargs):
        return user_mock

    async def fake_store_token(*args, **kwargs):
        return True

    monkeypatch.setattr("src.repositories.users.UserRepository.user_exists", fake_user_exists)
    monkeypatch.setattr("src.repositories.users.UserRepository.create_user", fake_create_user)
    monkeypatch.setattr("src.api.v1.auth.store_token_session", fake_store_token)

    response = client.post(
        "/api/v1/auth/register",
        json={"email": "new.user@example.com", "password": "StrongPass123", "name": "New User"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["user"]["email"] == "new.user@example.com"
    assert "access_token" in body
    assert "refresh_token" in body


@pytest.mark.asyncio
def test_login_rejects_invalid_credentials(client, monkeypatch: pytest.MonkeyPatch) -> None:
    """Test login fails with wrong password."""

    async def fake_verify(*args, **kwargs):
        return None

    monkeypatch.setattr("src.repositories.users.UserRepository.verify_credentials", fake_verify)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "unknown@example.com", "password": "WrongPass123"},
    )

    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


@pytest.mark.asyncio
def test_get_current_user_info(client) -> None:
    """Test fetching current user profile."""
    response = client.get("/api/v1/auth/me")

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == "citizen-1"
    assert body["email"] == "citizen@example.com"
    assert body["role"] == "CITIZEN"


@pytest.mark.asyncio
def test_logout_revokes_token(client, monkeypatch: pytest.MonkeyPatch) -> None:
    """Test logout revokes token session."""

    async def fake_revoke(*args, **kwargs):
        return True

    monkeypatch.setattr("src.api.v1.auth.revoke_token_session", fake_revoke)

    response = client.post("/api/v1/auth/logout")

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True


@pytest.mark.integration
def test_auth_me_returns_current_user_profile(client) -> None:
    response = client.get("/api/v1/auth/me")

    assert response.status_code == 200
    body = response.json()
    assert body["email"] == "citizen@example.com"
    assert body["role"] == "CITIZEN"


@pytest.mark.integration
def test_change_password_succeeds_for_basic_user(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_get_by_email(self, email: str):
        return {
            "id": "citizen-1",
            "email": email,
            "password_hash": "hashed-password",
        }

    async def fake_update_password(self, user_id: str, new_password: str) -> bool:
        return True

    monkeypatch.setattr(UserRepository, "get_by_email", fake_get_by_email)
    monkeypatch.setattr(UserRepository, "update_password", fake_update_password)

    response = client.post(
        "/api/v1/auth/change-password",
        json={
            "current_password": "OldStrong123",
            "new_password": "NewStrong123",
            "confirm_password": "NewStrong123",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True


@pytest.mark.integration
def test_logout_revokes_access_session(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_revoke(token: str, token_type: str) -> bool:
        return True

    monkeypatch.setattr("src.api.v1.auth.revoke_token_session", fake_revoke)

    response = client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": "Bearer access-token"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
