"""
Authentication Middleware
"""
from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.utils.token import verify_firebase_token
from src.utils.errors import AuthenticationError
from src.models import User
from sqlalchemy.orm import Session
from src.models.base import get_db
from typing import Optional
import structlog

logger = structlog.get_logger(__name__)
security = HTTPBearer(auto_error=False)

async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = None
) -> User:
    """
    Get current authenticated user

    Args:
        request: FastAPI request
        credentials: HTTP Bearer credentials

    Returns:
        User object

    Raises:
        AuthenticationError: If authentication fails
    """
    if not credentials:
        raise AuthenticationError("Authentication credentials required")

    try:
        # Verify Firebase token
        token_payload = await verify_firebase_token(credentials.credentials)

        # Get user from database
        db: Session = next(get_db())
        user = db.query(User).filter(User.firebase_uid == token_payload["uid"]).first()

        if not user:
            # Create user if not exists
            user = User(
                firebase_uid=token_payload["uid"],
                email=token_payload.get("email"),
                name=token_payload.get("name", "Unknown User"),
                role="citizen"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info("Created new user", user_id=user.id, firebase_uid=user.firebase_uid)

        if not user.is_active:
            raise AuthenticationError("Account is deactivated")

        return user

    except Exception as e:
        logger.error("Authentication failed", error=str(e))
        raise AuthenticationError("Authentication failed")

def require_role(required_role: str):
    """
    Dependency to require specific role

    Args:
        required_role: Required user role

    Returns:
        Dependency function
    """
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != required_role:
            raise AuthorizationError("Insufficient permissions")
        return current_user
    return role_checker