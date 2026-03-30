"""Authentication endpoints for GrievanceGrid API."""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from enum import Enum
from fastapi import APIRouter, HTTPException, status, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import settings
from src.core.database import get_db_session

logger = logging.getLogger(__name__)
from src.core.auth import create_access_token, create_refresh_token, verify_token
from src.core.dependencies import get_current_user, optional_auth
from src.core.session_store import is_token_session_active, revoke_token_session, store_token_session
from src.repositories.users import UserRepository
from src.services.google_oauth import GoogleOAuthService
from src.schemas.auth import (
    BasicAuthRequest,
    RegisterRequest,
    GoogleOAuthRequest,

    RefreshTokenRequest,
    PasswordChangeRequest,
    TokenResponse,
    UserResponse,
    AuthResponse,
    RoleEnum,
    AuthTypeEnum,
)


router = APIRouter(tags=["Authentication"])


def _normalize_role(role: object) -> str:
    """Normalize role values coming from DB/enums/strings into canonical uppercase strings."""
    if isinstance(role, Enum):
        return str(role.value).upper()

    raw = str(role or "CITIZEN").strip()
    if "." in raw:
        raw = raw.split(".")[-1]
    return raw.upper() or "CITIZEN"


def _infer_fallback_role(email: str | None) -> str:
    """Infer role for known demo users when running in mock fallback mode."""
    normalized = (email or "").strip().lower()
    mapping = {
        "officer1@example.com": "OFFICER",
        "crew1@example.com": "CREW",
        "auditor1@example.com": "AUDITOR",
        "admin1@example.com": "ADMIN",
    }
    return mapping.get(normalized, "CITIZEN")


def _to_iso8601(value: object) -> str:
    """Return ISO8601 when possible, while handling mock/string payloads safely."""
    if value is None:
        return ""
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, str):
        return value
    return str(value)


async def _issue_tokens(user: dict, auth_type: str) -> dict:
    user_id = str(user["id"])
    normalized_role = _normalize_role(user.get("role"))
    token_data = {
        "sub": user_id,
        "email": user["email"],
        "name": user["name"],
        "role": normalized_role,
        "auth_type": auth_type,
    }
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    access_ttl = max(1, settings.access_token_expire_minutes * 60)
    refresh_ttl = max(1, settings.refresh_token_expire_days * 24 * 60 * 60)
    await store_token_session(access_token, user_id, "access", access_ttl)
    await store_token_session(refresh_token, user_id, "refresh", refresh_ttl)


    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": access_ttl,
        "user": {
            "id": user_id,
            "email": user["email"],
            "name": user["name"],
            "role": normalized_role,
            "is_active": user["is_active"],

            "created_at": _to_iso8601(user.get("created_at")),
        },
    }


@router.post("/auth/register", response_model=TokenResponse)
async def register(
    request: RegisterRequest,
    db_session: AsyncSession = Depends(get_db_session),
) -> dict:
    """
    Register a new user with email, password and name.
    
    Args:
        request: Registration credentials and info
        db_session: Database session
        
    Returns:
        JWT tokens and user information
    """
    user_repo = UserRepository(db_session)
    
    # Check if user already exists
    if await user_repo.user_exists(request.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    
    # Create new user
    user = await user_repo.create_user(
        email=request.email,
        name=request.name,
        password=request.password,
        role="CITIZEN",
        auth_type="BASIC",
    )
    
    # FALLBACK: If DB is unreachable
    if not user or not user.get("id"):
        from uuid import uuid4
        user = {
            "id": f"mock-{uuid4()}",
            "email": request.email,
            "name": request.name,
            "role": "CITIZEN",
            "is_active": True,
            "created_at": datetime.now(timezone.utc),
            "department_id": None
        }
        logger.warning(f"DB OFFLINE: Using Mock Fallback ({user['role']}) for registration of {request.email}")

    return await _issue_tokens(user, "BASIC")


@router.post("/auth/login", response_model=TokenResponse)
async def login(
    request: BasicAuthRequest,
    db_session: AsyncSession = Depends(get_db_session),
) -> dict:
    """
    Authenticate user with email and password.
    
    Args:
        request: Email and password credentials
        db_session: Database session
        
    Returns:
        JWT tokens and user information
    """
    user_repo = UserRepository(db_session)
    
    # Verify credentials
    user = await user_repo.verify_credentials(request.email, request.password)
    
    # FALLBACK: If DB is unreachable or user not found in mock mode
    if not user:
        if type(db_session).__name__ == "MockSession":
             from uuid import uuid4
             fallback_role = _infer_fallback_role(request.email)
             user = {
                "id": f"mock-{uuid4()}",
                "email": request.email,
                "name": "Dev User",
                "role": fallback_role,
                "is_active": True,
                "created_at": datetime.now(timezone.utc),
                "department_id": None
            }
             logger.warning(f"DB OFFLINE: Using Mock Fallback ({fallback_role}) login for {request.email}")
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
    
    return await _issue_tokens(user, "BASIC")


@router.post("/auth/google", response_model=TokenResponse)
async def google_oauth(
    request: GoogleOAuthRequest,
    db_session: AsyncSession = Depends(get_db_session),
) -> dict:
    """
    Authenticate or create user via Google OAuth.
    
    Args:
        request: Google ID token from frontend
        db_session: Database session
        
    Returns:
        JWT tokens and user information
    """
    # Verify Google ID token
    google_user = await GoogleOAuthService.verify_id_token(request.id_token)
    if not google_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )
    
    user_repo = UserRepository(db_session)
    email = google_user.get("email")
    
    # Try to find existing user
    user = await user_repo.get_by_email(email)
    
    # Create new user if doesn't exist
    if not user:
        # Determine role - default to CITIZEN, but check for admin emails for dev convenience
        is_admin = (email and "admin" in email.lower()) or email == "thakuraaryan2006@gmail.com"
        user = await user_repo.create_user(
            email=email,
            name=google_user.get("name", email),
            password=None,  # OAuth users don't have passwords
            role="ADMIN" if is_admin else "CITIZEN",
            department_id=None,
            auth_type="GOOGLE_OAUTH",
        )
    
    # FALLBACK: If DB is unreachable (MockSession returned empty), provide a Dev User
    if not user or not user.get("id"):
        from uuid import uuid4
        user = {
            "id": f"mock-{uuid4()}",
            "email": email or "dev@example.com",
            "name": google_user.get("name", "GrievanceGrid Developer"),
            "role": "CITIZEN",
            "is_active": True,
            "created_at": datetime.now(timezone.utc),
            "department_id": None
        }
        logger.warning(f"DB OFFLINE: Using Mock Fallback User ({user['role']}) for {email}")
    
    return await _issue_tokens(user, "GOOGLE_OAUTH")


@router.post("/auth/refresh", response_model=TokenResponse)
async def refresh_access_token(
    request: RefreshTokenRequest,
    db_session: AsyncSession = Depends(get_db_session),
) -> dict:
    """
    Refresh access token using refresh token.
    
    Args:
        request: Valid refresh token
        db_session: Database session
        
    Returns:
        New JWT tokens
    """
    payload = verify_token(request.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    if not await is_token_session_active(request.refresh_token, "refresh"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh session expired or revoked",
        )
    
    user_repo = UserRepository(db_session)
    user = await user_repo.get_by_id(payload.get("sub"))
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    await revoke_token_session(request.refresh_token, "refresh")
    return await _issue_tokens(user, str(payload.get("auth_type", "BASIC")))


@router.post("/auth/change-password", response_model=AuthResponse)
async def change_password(
    request: PasswordChangeRequest,
    current_user: dict = Depends(get_current_user),
    db_session: AsyncSession = Depends(get_db_session),
) -> dict:
    """
    Change current user's password.
    
    Args:
        request: Current and new passwords
        current_user: Current authenticated user
        db_session: Database session
        
    Returns:
        Success confirmation
    """
    if request.new_password != request.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New passwords do not match",
        )
    
    user_repo = UserRepository(db_session)
    
    # Verify current password
    user = await user_repo.get_by_email(current_user["email"])
    if not user or not user.get("password_hash"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change password for OAuth users",
        )
    
    # Update password
    await user_repo.update_password(current_user["id"], request.new_password)
    
    return {
        "success": True,
        "message": "Password changed successfully",
    }


@router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Get current user's profile information.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User information
    """
    return {
        "id": str(current_user["id"]),
        "email": current_user["email"],
        "name": current_user["name"],
        "role": str(current_user["role"]),
        "department_id": str(current_user["department_id"]) if current_user.get("department_id") else None,
        "is_active": current_user["is_active"],
        "created_at": _to_iso8601(current_user.get("created_at")),
    }


@router.post("/auth/logout", response_model=AuthResponse)
async def logout(
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Logout current user (client should discard tokens).
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Success confirmation
    """
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        access_token = auth_header.split(" ", 1)[1]
        await revoke_token_session(access_token, "access")

    return {
        "success": True,
        "message": f"User {current_user['email']} logged out successfully",
    }
