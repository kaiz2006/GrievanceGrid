"""
Analytics Controller
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.models.base import get_db
from src.middlewares.auth_dependencies import get_current_user
from src.models import User
from src.services.analytics_service import AnalyticsService
from src.utils.responses import success_response

router = APIRouter()

@router.get("/stats")
async def get_complaint_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get complaint statistics"""
    if current_user.role not in ["admin", "officer"]:
        raise HTTPException(status_code=403, detail="Access denied")

    stats = AnalyticsService.get_complaint_stats(db)

    return success_response(stats)

@router.get("/departments")
async def get_department_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get department-wise statistics"""
    if current_user.role not in ["admin", "officer"]:
        raise HTTPException(status_code=403, detail="Access denied")

    stats = AnalyticsService.get_department_stats(db)

    return success_response({"departments": stats})

@router.get("/trends")
async def get_monthly_trends(
    months: int = 6,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get monthly complaint trends"""
    if current_user.role not in ["admin", "officer"]:
        raise HTTPException(status_code=403, detail="Access denied")

    trends = AnalyticsService.get_monthly_trends(db, months)

    return success_response({"trends": trends})