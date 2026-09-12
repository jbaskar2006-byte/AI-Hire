from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.candidate import CandidateProfile
from app.routers.auth import get_current_user
from app.schemas.candidate_score import MatchScoreBreakdown, CandidateRankingResponse
from app.services.match_service import (
    calculate_and_store_match,
    get_match_score,
    get_candidate_rankings_for_job
)

router = APIRouter(prefix="/ai", tags=["AI Job Matching & Candidate Ranking"])


@router.post("/calculate-match/{job_id}/{candidate_id}", response_model=MatchScoreBreakdown)
def calculate_match_endpoint(
    job_id: int,
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calculate and persist AI match score for a candidate and job.
    Accessible by recruiter or candidate (for their own candidate profile).
    """
    # Permission check for candidates
    if current_user.role == "candidate":
        candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
        if not candidate or (candidate.id != candidate_id and candidate.user_id != candidate_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Candidates can only calculate match scores for their own profile."
            )

    result = calculate_and_store_match(db, job_id=job_id, candidate_id=candidate_id)
    return result


@router.get("/match/{job_id}/{candidate_id}", response_model=MatchScoreBreakdown)
def get_match_endpoint(
    job_id: int,
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve stored or calculated match score breakdown for candidate and job.
    """
    # Permission check for candidates
    if current_user.role == "candidate":
        candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
        if not candidate or (candidate.id != candidate_id and candidate.user_id != candidate_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Candidates can only view match scores for their own profile."
            )

    result = get_match_score(db, job_id=job_id, candidate_id=candidate_id)
    return result


@router.get("/rank-candidates/{job_id}", response_model=CandidateRankingResponse)
def rank_candidates_endpoint(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Rank all applicants/candidates for a job, sorted descending by AI match score.
    Only recruiters and admins can access candidate rankings.
    """
    if current_user.role not in ["recruiter", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can view candidate rankings for jobs."
        )

    rankings = get_candidate_rankings_for_job(db, job_id=job_id)
    return rankings
