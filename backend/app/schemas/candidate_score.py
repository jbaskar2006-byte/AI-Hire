import datetime
from typing import List, Optional
from pydantic import BaseModel

class MatchScoreBreakdown(BaseModel):
    id: Optional[int] = None
    candidate_id: int
    job_id: int
    skill_score: float
    experience_score: float
    education_score: float
    similarity_score: float
    final_score: float
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None
    explanation: str = "Your score is based on skills, experience, education and resume relevance."
    ai_disclaimer: str = "AI Recommendation – Final hiring decision remains with the recruiter."

    class Config:
        from_attributes = True

class RankedCandidateItem(BaseModel):
    rank: int
    candidate_id: int
    candidate_name: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    experience_years: int = 0
    application_status: Optional[str] = None
    skill_score: float
    experience_score: float
    education_score: float
    similarity_score: float
    final_score: float
    medal: Optional[str] = None  # 🥇, 🥈, 🥉
    matched_skills: List[str] = []
    missing_skills: List[str] = []

class CandidateRankingResponse(BaseModel):
    job_id: int
    job_title: str
    total_candidates: int
    rankings: List[RankedCandidateItem]
    ai_disclaimer: str = "AI Recommendation – Final hiring decision remains with the recruiter."
