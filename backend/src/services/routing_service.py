"""
Routing Service
"""
from sqlalchemy.orm import Session
from src.models import Complaint, Department, GridLane
import structlog

logger = structlog.get_logger(__name__)

class RoutingService:
    """Service for intelligent complaint routing"""

    @staticmethod
    def route_complaint(db: Session, complaint: Complaint) -> None:
        """Route complaint to appropriate department and officer"""
        # Simple keyword-based routing
        department = RoutingService._find_department_by_keywords(db, complaint.category, complaint.description)

        if department:
            complaint.department_id = department.id

            # Find available officer in department
            officer = RoutingService._find_available_officer(db, department.id)
            if officer:
                complaint.assigned_officer_id = officer.id
                complaint.status = Status.ASSIGNED
            else:
                complaint.status = Status.SUBMITTED

        db.commit()
        logger.info("Complaint routed", complaint_id=complaint.id, department_id=complaint.department_id)

    @staticmethod
    def _find_department_by_keywords(db: Session, category: str, description: str) -> Department:
        """Find department based on keywords"""
        # Get all grid lanes
        grid_lanes = db.query(GridLane).filter(GridLane.is_active == True).all()

        for lane in grid_lanes:
            keywords = lane.keywords.lower().split(',') if lane.keywords else []
            text_to_check = f"{category} {description}".lower()

            if any(keyword.strip() in text_to_check for keyword in keywords):
                return lane.department

        # Default to first department
        return db.query(Department).first()

    @staticmethod
    def _find_available_officer(db: Session, department_id: int):
        """Find available officer in department"""
        from src.models import User

        # Simple: find officer with least assignments
        officers = db.query(User).filter(
            User.department_id == department_id,
            User.role == "officer",
            User.is_active == True
        ).all()

        if not officers:
            return None

        # Return first officer (in real app, would check workload)
        return officers[0]