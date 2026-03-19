"""RBAC and authentication middleware for FastAPI."""

from __future__ import annotations

from typing import Callable, Any, Optional
from functools import wraps

from fastapi import HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer
from starlette.authentication import AuthenticationError

from src.core.auth import verify_token, decode_token
from src.repositories.users import UserRepository
from src.core.database import get_db_session
from src.schemas.auth import RoleEnum, JWTPayload


async def get_current_user(
    request: Request,
    db_session=Depends(get_db_session),
) -> dict[str, Any]:
    """
    Dependency to extract and validate current user from JWT token.
    
    Args:
        request: HTTP request
        db_session: Database session
        
    Returns:
        Verified user information
        
    Raises:
        HTTPException 401/403 if token invalid or user not found
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = auth_header.split(" ")[1]
    
    # Verify token signature
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extract user info from token
    user_id: str = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify user still exists and is active
    user_repo = UserRepository(db_session)
    user = await user_repo.get_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Attach token payload for role checks
    user["token_payload"] = payload
    return user


def check_admin_role(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    """Check user is admin."""
    user_role = user.get("role")
    if user_role != RoleEnum.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User role '{user_role}' not authorized. Required: ADMIN",
        )
    return user


def check_officer_role(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    """Check user is officer or admin."""
    user_role = user.get("role")
    if user_role not in [RoleEnum.OFFICER, RoleEnum.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User role '{user_role}' not authorized. Required: OFFICER or ADMIN",
        )
    return user


def check_auditor_role(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    """Check user is auditor or admin."""
    user_role = user.get("role")
    if user_role not in [RoleEnum.AUDITOR, RoleEnum.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User role '{user_role}' not authorized. Required: AUDITOR or ADMIN",
        )
    return user


# Aliases for convenience
require_admin = check_admin_role
require_officer = check_officer_role
require_auditor = check_auditor_role


async def optional_auth(
    request: Request,
    db_session=Depends(get_db_session),
) -> dict[str, Any] | None:
    """
    Optional authentication - returns user if token present, else None.
    
    Useful for endpoints that support both authenticated and anonymous access.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    
    token = auth_header.split(" ")[1]
    payload = verify_token(token)
    
    if not payload:
        return None
    
    user_id: str = payload.get("sub")
    if not user_id:
        return None
    
    user_repo = UserRepository(db_session)
    user = await user_repo.get_by_id(user_id)
    
    if user:
        user["token_payload"] = payload
        return user
    
    return None


def verify_request_signature(request: Request) -> bool:
    """
    Verify request signature for service-to-service calls.
    
    Useful for verifying callbacks from worker tasks.
    """
    signature = request.headers.get("X-Signature")
    if not signature:
        return False
    
    # Implementation for signature verification
    # This would typically use HMAC-SHA256 with a shared secret
    return True
