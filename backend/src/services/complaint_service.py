"""
Complaint Service
"""
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from src.models import Complaint, User, Department, Assignment, StatusHistory, Status
from src.validators.complaint_validators import ComplaintCreate, ComplaintUpdate, ComplaintSearch
from src.utils.errors import NotFoundError, ValidationError
from src.services.routing_service import RoutingService
from src.services.sla_service import SLAService
import uuid
import structlog

logger = structlog.get_logger(__name__)

class ComplaintService:
    """Service for complaint operations"""

    @staticmethod
    def generate_grid_id() -> str:
        """Generate unique grid ID"""
        return f"GRID-{uuid.uuid4().hex[:8].upper()}"

    @staticmethod
    def create_complaint(db: Session, user_id: int, complaint_data: ComplaintCreate) -> Complaint:
        """Create new complaint"""
        # Generate grid ID
        grid_id = ComplaintService.generate_grid_id()

        # Create complaint
        complaint = Complaint(
            grid_id=grid_id,
            user_id=user_id,
            **complaint_data.dict()
        )

        db.add(complaint)
        db.commit()
        db.refresh(complaint)

        # Auto-route complaint
        RoutingService.route_complaint(db, complaint)

        # Set SLA
        SLAService.set_sla_deadline(db, complaint)

        logger.info("Complaint created", complaint_id=complaint.id, grid_id=complaint.grid_id)
        return complaint

    @staticmethod
    def get_complaint_by_id(db: Session, complaint_id: int) -> Complaint:
        """Get complaint by ID"""
        complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
        if not complaint:
            raise NotFoundError("Complaint")
        return complaint

    @staticmethod
    def get_complaint_by_grid_id(db: Session, grid_id: str) -> Complaint:
        """Get complaint by grid ID"""
        complaint = db.query(Complaint).filter(Complaint.grid_id == grid_id).first()
        if not complaint:
            raise NotFoundError("Complaint")
        return complaint

    @staticmethod
    def update_complaint(db: Session, complaint_id: int, update_data: ComplaintUpdate, updated_by: int) -> Complaint:
        """Update complaint"""
        complaint = ComplaintService.get_complaint_by_id(db, complaint_id)

        # Track status change
        old_status = complaint.status.value if complaint.status else None

        # Update fields
        update_dict = update_data.dict(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(complaint, field, value)

        db.commit()
        db.refresh(complaint)

        # Log status change
        if 'status' in update_dict and update_dict['status'] != old_status:
            status_history = StatusHistory(
                complaint_id=complaint_id,
                old_status=old_status,
                new_status=update_dict['status'],
                changed_by=updated_by,
                notes=update_data.notes
            )
            db.add(status_history)

        logger.info("Complaint updated", complaint_id=complaint.id, status=complaint.status.value)
        return complaint

    @staticmethod
    def search_complaints(db: Session, search_params: ComplaintSearch, user: User = None) -> list[Complaint]:
        """Search complaints"""
        query = db.query(Complaint)

        if search_params.query:
            query = query.filter(
                or_(
                    Complaint.title.ilike(f"%{search_params.query}%"),
                    Complaint.description.ilike(f"%{search_params.query}%")
                )
            )

        if search_params.status:
            query = query.filter(Complaint.status == search_params.status)

        if search_params.category:
            query = query.filter(Complaint.category.ilike(f"%{search_params.category}%"))

        if search_params.department_id:
            query = query.filter(Complaint.department_id == search_params.department_id)

        if search_params.priority:
            query = query.filter(Complaint.priority == search_params.priority)

        # Role-based filtering
        if user and user.role == "officer":
            query = query.filter(
                or_(
                    Complaint.assigned_officer_id == user.id,
                    and_(Complaint.department_id == user.department_id, Complaint.assigned_officer_id.is_(None))
                )
            )
        elif user and user.role == "citizen":
            query = query.filter(Complaint.user_id == user.id)

        return query.all()

    @staticmethod
    def assign_complaint(db: Session, complaint_id: int, officer_id: int, assigned_by: int) -> Complaint:
        """Assign complaint to officer"""
        complaint = ComplaintService.get_complaint_by_id(db, complaint_id)
        officer = db.query(User).filter(User.id == officer_id, User.role == "officer").first()

        if not officer:
            raise NotFoundError("Officer")

        complaint.assigned_officer_id = officer_id
        complaint.status = Status.ASSIGNED

        # Create assignment record
        assignment = Assignment(
            complaint_id=complaint_id,
            officer_id=officer_id,
            notes=f"Assigned by user {assigned_by}"
        )
        db.add(assignment)

        db.commit()
        db.refresh(complaint)

        logger.info("Complaint assigned", complaint_id=complaint.id, officer_id=officer_id)
        return complaint