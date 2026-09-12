from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.candidate import CandidateProfile
from app.routers.auth import get_current_user
from app.schemas.interview_question import (
    InterviewGenerateRequest,
    CategorizedQuestionsResponse
)
from app.services.interview_service import (
    generate_and_save_interview_questions,
    get_candidate_job_questions
)

router = APIRouter(prefix="/ai", tags=["AI Interview Questions"])


@router.post("/interview-questions", response_model=CategorizedQuestionsResponse)
def generate_interview_questions_endpoint(
    req: InterviewGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    POST /api/ai/interview-questions
    Generates intelligent rule-based interview questions categorized into:
    Technical, HR, Project, and Skill-Based questions.
    Persists generated questions in MySQL `interview_questions` table.
    """
    if current_user.role == "candidate":
        from app.services.candidate_service import CandidateService
        candidate = CandidateService.get_or_create_profile(db, current_user)
        if candidate.id != req.candidate_id and candidate.user_id != req.candidate_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Candidates can only generate interview questions for their own profile."
            )

    result = generate_and_save_interview_questions(
        db,
        job_id=req.job_id,
        candidate_id=req.candidate_id,
        num_questions=req.num_questions or 10
    )
    return result


@router.get("/interview-questions/{job_id}/{candidate_id}", response_model=CategorizedQuestionsResponse)
def get_interview_questions_endpoint(
    job_id: int,
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    GET /api/ai/interview-questions/{job_id}/{candidate_id}
    Retrieves stored interview questions for job & candidate.
    Auto-generates questions if none exist yet.
    """
    if current_user.role == "candidate":
        from app.services.candidate_service import CandidateService
        candidate = CandidateService.get_or_create_profile(db, current_user)
        if candidate.id != candidate_id and candidate.user_id != candidate_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Candidates can only view interview questions for their own profile."
            )

    result = get_candidate_job_questions(db, job_id=job_id, candidate_id=candidate_id)
    return result
