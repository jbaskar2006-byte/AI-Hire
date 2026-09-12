from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class InterviewGenerateRequest(BaseModel):
    job_id: int
    candidate_id: int
    num_questions: Optional[int] = Field(default=10, ge=1, le=30)

class InterviewQuestionResponse(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    category: str
    question: str
    created_at: datetime

    class Config:
        from_attributes = True

class CategorizedQuestionsResponse(BaseModel):
    candidate_id: int
    job_id: int
    job_title: Optional[str] = None
    total_questions: int
    questions_by_category: Dict[str, List[InterviewQuestionResponse]]
    questions: List[InterviewQuestionResponse]
