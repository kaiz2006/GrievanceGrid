"""
Complaint Controller
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from src.models.base import get_db
from src.middlewares.auth_dependencies import get_current_user
from src.models import User
from src.services.complaint_service import ComplaintService
from src.validators.complaint_validators import (
    ComplaintCreate, ComplaintUpdate, ComplaintListParams
)
from src.utils.responses import success_response
from slowapi import Limiter
from slowapi.util import get_remote_address
import structlog

logger = structlog.get_logger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.post("/")
# @limiter.limit("10/minute")
async def create_complaint(
    complaint_data: ComplaintCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new complaint"""
    complaint = ComplaintService.create_complaint(db, current_user.id, complaint_data)

    return success_response({
        "complaint": {
            "id": complaint.id,
            "grid_id": complaint.grid_id,
            "status": complaint.status.value,
            "created_at": complaint.created_at
        }
    }, "Complaint created successfully")

@router.get("/")
async def list_complaints(
    params: ComplaintListParams = Depends(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List complaints with pagination"""
    complaints = ComplaintService.search_complaints(db, params, current_user)

    # Paginate
    start = (params.page - 1) * params.per_page
    end = start + params.per_page
    paginated_complaints = complaints[start:end]

    return success_response({
        "complaints": [
            {
                "id": c.id,
                "grid_id": c.grid_id,
                "title": c.title,
                "status": c.status.value,
                "priority": c.priority.value,
                "created_at": c.created_at
            }
            for c in paginated_complaints
        ],
        "pagination": {
            "page": params.page,
            "per_page": params.per_page,
            "total": len(complaints)
        }
    })

@router.get("/{complaint_id}")
async def get_complaint(
    complaint_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get complaint details"""
    complaint = ComplaintService.get_complaint_by_id(db, complaint_id)

    # Check permissions
    if current_user.role == "citizen" and complaint.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return success_response({
        "complaint": {
            "id": complaint.id,
            "grid_id": complaint.grid_id,
            "title": complaint.title,
            "description": complaint.description,
            "category": complaint.category,
            "status": complaint.status.value,
            "priority": complaint.priority.value,
            "latitude": complaint.latitude,
            "longitude": complaint.longitude,
            "address": complaint.address,
            "created_at": complaint.created_at,
            "updated_at": complaint.updated_at
        }
    })

@router.put("/{complaint_id}")
async def update_complaint(
    complaint_id: int,
    update_data: ComplaintUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update complaint"""
    # Check permissions
    if current_user.role not in ["officer", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")

    complaint = ComplaintService.update_complaint(db, complaint_id, update_data, current_user.id)

    return success_response({
        "complaint": {
            "id": complaint.id,
            "status": complaint.status.value,
            "updated_at": complaint.updated_at
        }
    }, "Complaint updated successfully")