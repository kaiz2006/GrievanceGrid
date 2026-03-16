"""
Officer Controller
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.models.base import get_db
from src.middlewares.auth_dependencies import get_current_user
from src.models import User
from src.services.officer_service import OfficerService
from src.validators.officer_validators import StatusUpdate
from src.utils.responses import success_response

router = APIRouter()

@router.get("/complaints")
async def get_assigned_complaints(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get complaints assigned to current officer"""
    if current_user.role != "officer":
        raise HTTPException(status_code=403, detail="Access denied")

    complaints = OfficerService.get_assigned_complaints(db, current_user.id)

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
            for c in complaints
        ]
    })

@router.put("/complaints/{complaint_id}/status")
async def update_complaint_status(
    complaint_id: int,
    status_update: StatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update complaint status"""
    if current_user.role != "officer":
        raise HTTPException(status_code=403, detail="Access denied")

    complaint = OfficerService.update_complaint_status(
        db, complaint_id, status_update, current_user.id
    )

    return success_response({
        "complaint": {
            "id": complaint.id,
            "status": complaint.status.value,
            "updated_at": complaint.updated_at
        }
    }, "Status updated successfully")