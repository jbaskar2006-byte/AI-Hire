from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.company import CompanyResponse

class RecruiterProfileBase(BaseModel):
    phone: Optional[str] = Field(None, max_length=30, example="+1 (555) 019-2831")
    designation: Optional[str] = Field(None, max_length=100, example="Senior Talent Acquisition Lead")
    company_id: Optional[int] = Field(None, example=1)

class RecruiterProfileCreate(RecruiterProfileBase):
    pass

class RecruiterProfileUpdate(RecruiterProfileBase):
    pass

class RecruiterProfileResponse(RecruiterProfileBase):
    id: int
    user_id: int
    full_name: str
    email: str
    company: Optional[CompanyResponse] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
