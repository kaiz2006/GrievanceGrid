"""
Authentication Controller
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.models.base import get_db
from src.middlewares.auth_dependencies import get_current_user
from src.models import User
from src.utils.responses import success_response
from src.validators.auth_validators import FirebaseToken
import structlog

logger = structlog.get_logger(__name__)
router = APIRouter()

@router.post("/login")
async def login(
    token_data: FirebaseToken,
    db: Session = Depends(get_db)
):
    """Login with Firebase token and return user info"""
    try:
        # Token verification is handled by get_current_user dependency
        user = await get_current_user(token_data.token)

        return success_response({
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        })
    except Exception as e:
        logger.error("Login failed", error=str(e))
        raise HTTPException(status_code=401, detail="Login failed")

@router.post("/verify")
async def verify_token(
    token_data: FirebaseToken,
    db: Session = Depends(get_db)
):
    """Verify Firebase token and return user info"""
    try:
        # Token verification is handled by get_current_user dependency
        user = await get_current_user(token_data.token)

        return success_response({
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        })
    except Exception as e:
        logger.error("Token verification failed", error=str(e))
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return success_response({
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role,
            "department_id": current_user.department_id
        }
    })