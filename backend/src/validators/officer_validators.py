"""
Officer Validators
"""
from pydantic import BaseModel, Field
from typing import Optional
from .common import PaginationParams

class OfficerAssignment(BaseModel):
    """Officer assignment data"""
    complaint_id: int = Field(..., gt=0)
    officer_id: int = Field(..., gt=0)
    notes: Optional[str] = Field(None, max_length=1000)

class StatusUpdate(BaseModel):
    """Status update data"""
    status: str = Field(..., pattern="^(assigned|in_progress|resolved|closed|escalated)$")
    notes: Optional[str] = Field(None, max_length=1000)

class OfficerDashboardParams(PaginationParams):
    """Officer dashboard parameters"""
    status: Optional[str] = None
    priority: Optional[str] = None