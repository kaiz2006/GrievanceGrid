"""
Department Controller
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.models.base import get_db
from src.middlewares.auth_dependencies import get_current_user
from src.models import User
from src.services.department_service import DepartmentService
from src.utils.responses import success_response

router = APIRouter()

@router.get("/")
async def list_departments(db: Session = Depends(get_db)):
    """List all departments"""
    departments = DepartmentService.get_all_departments(db)

    return success_response({
        "departments": [
            {
                "id": d.id,
                "name": d.name,
                "code": d.code,
                "description": d.description
            }
            for d in departments
        ]
    })

@router.get("/{department_id}")
async def get_department(department_id: int, db: Session = Depends(get_db)):
    """Get department details"""
    department = DepartmentService.get_department_by_id(db, department_id)

    return success_response({
        "department": {
            "id": department.id,
            "name": department.name,
            "code": department.code,
            "description": department.description
        }
    })