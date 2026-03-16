"""
Complaint Validators
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from .common import PaginationParams

class ComplaintCreate(BaseModel):
    """Complaint creation data"""
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=2000)
    category: str = Field(..., min_length=1, max_length=100)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    address: Optional[str] = Field(None, max_length=500)

class ComplaintUpdate(BaseModel):
    """Complaint update data"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1, max_length=2000)
    status: Optional[str] = Field(None, pattern="^(submitted|assigned|in_progress|resolved|closed|escalated)$")
    priority: Optional[str] = Field(None, pattern="^(low|medium|high|urgent)$")
    notes: Optional[str] = Field(None, max_length=1000)

class ComplaintSearch(BaseModel):
    """Complaint search parameters"""
    query: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    department_id: Optional[int] = None
    priority: Optional[str] = None

class ComplaintListParams(PaginationParams):
    """Complaint list parameters"""
    status: Optional[str] = None
    category: Optional[str] = None
    department_id: Optional[int] = None
    priority: Optional[str] = None
    assigned_to_me: Optional[bool] = None