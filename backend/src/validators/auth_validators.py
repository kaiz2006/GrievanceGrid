"""
Authentication Validators
"""
from pydantic import BaseModel, Field
from typing import Optional

class FirebaseToken(BaseModel):
    """Firebase ID token"""
    token: str = Field(..., min_length=1)

class UserCreate(BaseModel):
    """User creation data"""
    firebase_uid: str = Field(..., min_length=1)
    email: Optional[str] = None
    phone: Optional[str] = None
    name: str = Field(..., min_length=1)
    role: str = Field("citizen", pattern="^(citizen|officer|admin)$")

class UserUpdate(BaseModel):
    """User update data"""
    name: Optional[str] = None
    role: Optional[str] = Field(None, pattern="^(citizen|officer|admin)$")