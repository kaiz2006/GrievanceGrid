"""
Department Service
"""
from sqlalchemy.orm import Session
from src.models import Department
from src.utils.errors import NotFoundError, ConflictError
import structlog

logger = structlog.get_logger(__name__)

class DepartmentService:
    """Service for department operations"""

    @staticmethod
    def get_department_by_id(db: Session, department_id: int) -> Department:
        """Get department by ID"""
        department = db.query(Department).filter(Department.id == department_id).first()
        if not department:
            raise NotFoundError("Department")
        return department

    @staticmethod
    def get_all_departments(db: Session) -> list[Department]:
        """Get all active departments"""
        return db.query(Department).filter(Department.is_active == True).all()

    @staticmethod
    def create_department(db: Session, name: str, code: str, description: str = None) -> Department:
        """Create new department"""
        # Check if code already exists
        existing = db.query(Department).filter(Department.code == code).first()
        if existing:
            raise ConflictError("Department code already exists")

        department = Department(
            name=name,
            code=code,
            description=description
        )
        db.add(department)
        db.commit()
        db.refresh(department)

        logger.info("Department created", department_id=department.id)
        return department