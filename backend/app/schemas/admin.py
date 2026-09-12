from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AdminStatsResponse(BaseModel):
    total_users: int
    total_candidates: int
    total_recruiters: int
    total_companies: int
    active_jobs: int
    total_applications: int
    resumes_processed: int

class MonthlyApplicationMetric(BaseModel):
    month: str
    count: int

class RoleMetric(BaseModel):
    role: str
    count: int

class JobTypeMetric(BaseModel):
    job_type: str
    count: int

class ApplicationStatusMetric(BaseModel):
    status: str
    count: int

class ScoreDistributionMetric(BaseModel):
    range: str
    count: int

class SkillMetric(BaseModel):
    skill: str
    count: int

class AdminAnalyticsResponse(BaseModel):
    applications_per_month: List[MonthlyApplicationMetric]
    users_by_role: List[RoleMetric]
    jobs_by_type: List[JobTypeMetric]
    application_status: List[ApplicationStatusMetric]
    candidate_score_distribution: List[ScoreDistributionMetric]
    top_skills: List[SkillMetric]

class UserAdminResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    company: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserStatusUpdate(BaseModel):
    is_active: bool

class JobAdminResponse(BaseModel):
    id: int
    title: str
    company_name: str
    status: str
    job_type: str
    location: str
    created_at: datetime

    class Config:
        from_attributes = True

class JobStatusUpdate(BaseModel):
    status: str

class ApplicationAdminResponse(BaseModel):
    id: int
    job_id: int
    job_title: str
    candidate_id: int
    candidate_name: str
    status: str
    match_score: Optional[float] = None
    applied_at: datetime

    class Config:
        from_attributes = True
