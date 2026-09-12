from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.candidate import CandidateProfile
from app.routers.auth import get_current_user
from app.services.recommendation_service import (
    get_skill_gap_analysis,
    get_recommended_jobs_for_candidate
)

router = APIRouter(prefix="/ai", tags=["AI Recommendations & Skill Gap"])


@router.get("/skill-gap/{job_id}/{candidate_id}")
def get_skill_gap_endpoint(
    job_id: int,
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Skill Gap Analysis:
    Compares candidate skills vs job required & preferred skills.
    Returns Matched Skills, Missing Skills, Skill Coverage %, and Learning Recommendations.
    """
    # Permission check for candidates
    if current_user.role == "candidate":
        candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
        if not candidate or (candidate.id != candidate_id and candidate.user_id != candidate_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Candidates can only request skill gap analysis for their own profile."
            )

    result = get_skill_gap_analysis(db, job_id=job_id, candidate_id=candidate_id)
    return result


@router.get("/recommend-jobs")
def recommend_jobs_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Personalized AI Job Recommendations for the logged-in candidate.
    Analyzes candidate's skills, experience, education, and resume against active jobs.
    Returns top recommendations sorted descending by AI match score.
    """
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Job recommendations are only available for candidate users."
        )

    recommendations = get_recommended_jobs_for_candidate(db, current_user=current_user)
    return recommendations
