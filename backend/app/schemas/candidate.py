from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, HttpUrl
from app.models.candidate import SkillLevelEnum

# Candidate Skills Schemas
class CandidateSkillBase(BaseModel):
    skill_name: str = Field(..., min_length=1, max_length=100, example="Python")
    skill_level: SkillLevelEnum = Field(SkillLevelEnum.INTERMEDIATE, example=SkillLevelEnum.ADVANCED)

class CandidateSkillCreate(CandidateSkillBase):
    pass

class CandidateSkillUpdate(BaseModel):
    skill_name: Optional[str] = Field(None, min_length=1, max_length=100)
    skill_level: Optional[SkillLevelEnum] = None

class CandidateSkillResponse(CandidateSkillBase):
    id: int
    candidate_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Candidate Profile Schemas
class CandidateProfileBase(BaseModel):
    phone: Optional[str] = Field(None, max_length=30, example="+1 (555) 019-2831")
    location: Optional[str] = Field(None, max_length=150, example="San Francisco, CA")
    education: Optional[str] = Field(None, max_length=255, example="B.S. Computer Science, Stanford")
    experience_years: Optional[int] = Field(0, ge=0, example=4)
    linkedin_url: Optional[str] = Field(None, max_length=255, example="https://linkedin.com/in/johndoe")
    github_url: Optional[str] = Field(None, max_length=255, example="https://github.com/johndoe")
    portfolio_url: Optional[str] = Field(None, max_length=255, example="https://johndoe.dev")

class CandidateProfileCreate(CandidateProfileBase):
    pass

class CandidateProfileUpdate(CandidateProfileBase):
    pass

class CandidateProfileResponse(CandidateProfileBase):
    id: int
    user_id: int
    full_name: str
    email: str
    profile_completion: int = Field(..., description="Calculated profile completion percentage (0-100%)")
    skills: List[CandidateSkillResponse] = []
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
