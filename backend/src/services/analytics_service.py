"""
Analytics Service
"""
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from src.models import Complaint, Department, User
from datetime import datetime, timedelta
import structlog

logger = structlog.get_logger(__name__)

class AnalyticsService:
    """Service for analytics and reporting"""

    @staticmethod
    def get_complaint_stats(db: Session) -> dict:
        """Get complaint statistics"""
        total = db.query(func.count(Complaint.id)).scalar()
        resolved = db.query(func.count(Complaint.id)).filter(Complaint.status == "resolved").scalar()
        pending = db.query(func.count(Complaint.id)).filter(Complaint.status.in_(["submitted", "assigned", "in_progress"])).scalar()

        return {
            "total_complaints": total,
            "resolved_complaints": resolved,
            "pending_complaints": pending,
            "resolution_rate": (resolved / total * 100) if total > 0 else 0
        }

    @staticmethod
    def get_department_stats(db: Session) -> list[dict]:
        """Get department-wise statistics"""
        results = db.query(
            Department.name,
            func.count(Complaint.id).label("total"),
            func.count(Complaint.id).filter(Complaint.status == "resolved").label("resolved")
        ).join(Complaint, Department.id == Complaint.department_id, isouter=True)\
         .group_by(Department.id, Department.name).all()

        return [
            {
                "department": row.name,
                "total_complaints": row.total,
                "resolved_complaints": row.resolved,
                "resolution_rate": (row.resolved / row.total * 100) if row.total > 0 else 0
            }
            for row in results
        ]

    @staticmethod
    def get_monthly_trends(db: Session, months: int = 6) -> list[dict]:
        """Get monthly complaint trends"""
        start_date = datetime.utcnow() - timedelta(days=months*30)

        results = db.query(
            extract('year', Complaint.created_at).label('year'),
            extract('month', Complaint.created_at).label('month'),
            func.count(Complaint.id).label('count')
        ).filter(Complaint.created_at >= start_date)\
         .group_by(extract('year', Complaint.created_at), extract('month', Complaint.created_at))\
         .order_by(extract('year', Complaint.created_at), extract('month', Complaint.created_at)).all()

        return [
            {
                "year": int(row.year),
                "month": int(row.month),
                "complaints": row.count
            }
            for row in results
        ]