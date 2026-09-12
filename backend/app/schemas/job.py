import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, model_validator
from app.models.job import JobStatusEnum, JobTypeEnum, SkillTypeEnum

class JobSkillCreate(BaseModel):
    skill_name: str = Field(..., min_length=1, max_length=100)
    skill_type: SkillTypeEnum = SkillTypeEnum.REQUIRED

class JobSkillResponse(BaseModel):
    id: int
    job_id: int
    skill_name: str
    skill_type: SkillTypeEnum
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class CompanySummaryResponse(BaseModel):
    id: int
    name: str
    industry: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None

    class Config:
        from_attributes = True

class JobCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    description: str = Field(..., min_length=10)
    location: str = Field(..., min_length=2, max_length=150)
    job_type: JobTypeEnum = JobTypeEnum.FULL_TIME
    min_experience: int = Field(0, ge=0)
    salary_min: Optional[float] = Field(None, ge=0)
    salary_max: Optional[float] = Field(None, ge=0)
    deadline: Optional[datetime.date] = None
    status: JobStatusEnum = JobStatusEnum.ACTIVE
    skills: List[JobSkillCreate] = []

    @model_validator(mode="after")
    def validate_salaries(self):
        if self.salary_min is not None and self.salary_max is not None:
            if self.salary_max < self.salary_min:
                raise ValueError("Salary maximum cannot be less than salary minimum")
        return self

class JobUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, min_length=10)
    location: Optional[str] = Field(None, min_length=2, max_length=150)
    job_type: Optional[JobTypeEnum] = None
    min_experience: Optional[int] = Field(None, ge=0)
    salary_min: Optional[float] = Field(None, ge=0)
    salary_max: Optional[float] = Field(None, ge=0)
    deadline: Optional[datetime.date] = None
    status: Optional[JobStatusEnum] = None
    skills: Optional[List[JobSkillCreate]] = None

    @model_validator(mode="after")
    def validate_salaries(self):
        if self.salary_min is not None and self.salary_max is not None:
            if self.salary_max < self.salary_min:
                raise ValueError("Salary maximum cannot be less than salary minimum")
        return self

class JobResponse(BaseModel):
    id: int
    recruiter_id: int
    company_id: int
    title: str
    description: str
    location: str
    job_type: JobTypeEnum
    min_experience: int
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    deadline: Optional[datetime.date] = None
    status: JobStatusEnum
    created_at: datetime.datetime
    updated_at: datetime.datetime
    company: Optional[CompanySummaryResponse] = None
    skills: List[JobSkillResponse] = []
    applications_count: int = 0
    has_applied: bool = False

    class Config:
        from_attributes = True

class JobListResponse(BaseModel):
    items: List[JobResponse]
    total: int
    page: int
    size: int
    pages: int
