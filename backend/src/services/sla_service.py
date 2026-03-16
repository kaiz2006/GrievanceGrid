"""
SLA Service
"""
from sqlalchemy.orm import Session
from src.models import Complaint, SLARule
from datetime import datetime, timedelta
import structlog

logger = structlog.get_logger(__name__)

class SLAService:
    """Service for SLA management"""

    @staticmethod
    def set_sla_deadline(db: Session, complaint: Complaint) -> None:
        """Set SLA deadline for complaint"""
        # Find matching SLA rule
        sla_rule = db.query(SLARule).filter(
            SLARule.category.ilike(f"%{complaint.category}%"),
            SLARule.priority == complaint.priority.value,
            SLARule.is_active == True
        ).first()

        if sla_rule:
            deadline = datetime.utcnow() + timedelta(hours=sla_rule.hours_to_resolve)
            complaint.sla_deadline = deadline

        db.commit()
        logger.info("SLA set", complaint_id=complaint.id, deadline=complaint.sla_deadline)

    @staticmethod
    def check_sla_violations(db: Session) -> list[Complaint]:
        """Check for SLA violations"""
        now = datetime.utcnow()
        violations = db.query(Complaint).filter(
            Complaint.sla_deadline < now,
            Complaint.status.in_([Status.SUBMITTED, Status.ASSIGNED, Status.IN_PROGRESS])
        ).all()

        return violations