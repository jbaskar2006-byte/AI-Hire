import datetime
from typing import List, Optional, Dict
from pydantic import BaseModel
from app.models.resume import AnalysisStatusEnum

class ResumeSkillResponse(BaseModel):
    id: Optional[int] = None
    skill_name: str
    confidence: float = 1.0

    class Config:
        from_attributes = True

class PersonalInformation(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class SkillCategoryGroup(BaseModel):
    category: str
    skills: List[str] = []

class ResumeAnalysisResult(BaseModel):
    personal_information: PersonalInformation
    extracted_skills: List[ResumeSkillResponse] = []
    skills_by_category: Dict[str, List[str]] = {}
    education: List[str] = []
    experience: List[str] = []
    projects: List[str] = []
    certifications: List[str] = []
    total_skills_count: int = 0

class ResumeSummaryResponse(BaseModel):
    id: int
    candidate_id: int
    original_filename: str
    stored_filename: str
    file_type: str
    file_size: int
    analysis_status: AnalysisStatusEnum
    uploaded_at: datetime.datetime
    extracted_skills_count: int = 0

    class Config:
        from_attributes = True

class ResumeUploadResponse(BaseModel):
    resume: ResumeSummaryResponse
    analysis: ResumeAnalysisResult
