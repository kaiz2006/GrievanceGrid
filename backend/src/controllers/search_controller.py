"""
Search Controller
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from src.models.base import get_db
from src.middlewares.auth_dependencies import get_current_user
from src.models import User
from src.services.search_service import SearchService
from src.utils.responses import success_response

router = APIRouter()

@router.get("/")
async def search_complaints(
    q: str = Query(..., min_length=1, description="Search query"),
    status: str = None,
    priority: str = None,
    department_id: int = None,
    limit: int = Query(50, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search complaints"""
    filters = {}
    if status:
        filters['status'] = status
    if priority:
        filters['priority'] = priority
    if department_id:
        filters['department_id'] = department_id

    complaints = SearchService.search_complaints(db, q, filters, limit)

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
        ],
        "count": len(complaints)
    })