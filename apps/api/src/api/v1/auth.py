"""Authentication endpoints for GrievanceGrid API."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, status, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import settings
from src.core.database import get_db_session
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


async def _issue_tokens(user: dict, auth_type: str) -> dict:
    user_id = str(user["id"])
    token_data = {
        "sub": user_id,
        "email": user["email"],
        "name": user["name"],
        "role": str(user["role"]),
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
            "role": str(user["role"]),
            "is_active": user["is_active"],

            "created_at": user["created_at"].isoformat() if user["created_at"] else "",
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
    if not user:
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
        user = await user_repo.create_user(
            email=email,
            name=google_user.get("name", email),
            password=None,  # OAuth users don't have passwords
            role="CITIZEN",
            auth_type="GOOGLE_OAUTH",
        )
    
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
        "created_at": current_user["created_at"].isoformat()
        if current_user.get("created_at")
        else "",
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
