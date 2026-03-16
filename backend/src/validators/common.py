"""
Common Validators
"""
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class PaginationParams(BaseModel):
    """Pagination parameters"""
    page: int = Field(1, ge=1)
    per_page: int = Field(10, ge=1, le=100)

class DateRange(BaseModel):
    """Date range filter"""
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

    @validator('end_date')
    def end_date_must_be_after_start(cls, v, values):
        if v and values.get('start_date') and v < values['start_date']:
            raise ValueError('end_date must be after start_date')
        return v