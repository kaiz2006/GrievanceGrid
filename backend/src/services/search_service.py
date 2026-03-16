"""
Search Service
"""
from sqlalchemy.orm import Session
from sqlalchemy import or_
from src.models import Complaint
from typing import List
import structlog

logger = structlog.get_logger(__name__)

class SearchService:
    """Service for advanced search operations"""

    @staticmethod
    def search_complaints(
        db: Session,
        query: str,
        filters: dict = None,
        limit: int = 50
    ) -> List[Complaint]:
        """Advanced complaint search"""
        search_query = db.query(Complaint)

        # Text search
        if query:
            search_terms = query.split()
            for term in search_terms:
                search_query = search_query.filter(
                    or_(
                        Complaint.title.ilike(f"%{term}%"),
                        Complaint.description.ilike(f"%{term}%"),
                        Complaint.category.ilike(f"%{term}%"),
                        Complaint.grid_id.ilike(f"%{term}%")
                    )
                )

        # Apply filters
        if filters:
            if filters.get('status'):
                search_query = search_query.filter(Complaint.status == filters['status'])
            if filters.get('priority'):
                search_query = search_query.filter(Complaint.priority == filters['priority'])
            if filters.get('department_id'):
                search_query = search_query.filter(Complaint.department_id == filters['department_id'])
            if filters.get('date_from'):
                search_query = search_query.filter(Complaint.created_at >= filters['date_from'])
            if filters.get('date_to'):
                search_query = search_query.filter(Complaint.created_at <= filters['date_to'])

        return search_query.limit(limit).all()