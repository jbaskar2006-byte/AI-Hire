import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.models.job import ApplicationStatusEnum
from app.schemas.job import JobResponse

class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatusEnum

class CandidateSummaryResponse(BaseModel):
    id: int
    user_id: int
    name: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    education: Optional[str] = None
    experience_years: int = 0
    skills: List[str] = []
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None

    class Config:
        from_attributes = True

class ApplicationResponse(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    status: ApplicationStatusEnum
    applied_at: datetime.datetime
    updated_at: datetime.datetime
    job: Optional[JobResponse] = None
    candidate: Optional[CandidateSummaryResponse] = None

    class Config:
        from_attributes = True
