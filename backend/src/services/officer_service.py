"""
Officer Service
"""
from sqlalchemy.orm import Session
from src.models import Complaint, User, Assignment
from src.validators.officer_validators import OfficerAssignment, StatusUpdate
from src.utils.errors import NotFoundError, ValidationError
from src.services.complaint_service import ComplaintService
import structlog

logger = structlog.get_logger(__name__)

class OfficerService:
    """Service for officer operations"""

    @staticmethod
    def get_assigned_complaints(db: Session, officer_id: int) -> list[Complaint]:
        """Get complaints assigned to officer"""
        return db.query(Complaint).filter(
            Complaint.assigned_officer_id == officer_id,
            Complaint.status.in_(["assigned", "in_progress"])
        ).all()

    @staticmethod
    def update_complaint_status(
        db: Session,
        complaint_id: int,
        status_update: StatusUpdate,
        officer_id: int
    ) -> Complaint:
        """Update complaint status by officer"""
        complaint = ComplaintService.get_complaint_by_id(db, complaint_id)

        # Verify officer is assigned
        if complaint.assigned_officer_id != officer_id:
            raise ValidationError("Officer not assigned to this complaint")

        # Update status
        from src.validators.complaint_validators import ComplaintUpdate
        update_data = ComplaintUpdate(status=status_update.status, notes=status_update.notes)

        return ComplaintService.update_complaint(db, complaint_id, update_data, officer_id)