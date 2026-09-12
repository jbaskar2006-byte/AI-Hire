from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_candidate
from app.models.user import User
from app.schemas.candidate import (
    CandidateProfileUpdate,
    CandidateProfileResponse,
    CandidateSkillCreate,
    CandidateSkillUpdate,
    CandidateSkillResponse
)
from app.services.candidate_service import CandidateService

router = APIRouter(prefix="/candidate", tags=["Candidate Management"])

@router.get("/profile", response_model=CandidateProfileResponse)
def get_candidate_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate)
):
    """
    Get Candidate Profile including dynamic profile completion percentage and skills list.
    Restricted to candidate role.
    """
    profile = CandidateService.get_or_create_profile(db=db, user=current_user)
    skills = CandidateService.get_skills(db=db, user=current_user)
    
    response_data = CandidateProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        full_name=current_user.name,
        email=current_user.email,
        phone=profile.phone or current_user.phone,
        location=profile.location,
        education=profile.education,
        experience_years=profile.experience_years or 0,
        linkedin_url=profile.linkedin_url,
        github_url=profile.github_url,
        portfolio_url=profile.portfolio_url,
        profile_completion=profile.profile_completion,
        skills=[CandidateSkillResponse.model_validate(s) for s in skills],
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )
    return response_data

@router.put("/profile", response_model=CandidateProfileResponse)
def update_candidate_profile(
    profile_in: CandidateProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate)
):
    """
    Create or Update Candidate Profile. Automatically recalculates profile completion score.
    """
    profile = CandidateService.update_profile(db=db, user=current_user, profile_in=profile_in)
    skills = CandidateService.get_skills(db=db, user=current_user)

    response_data = CandidateProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        full_name=current_user.name,
        email=current_user.email,
        phone=profile.phone or current_user.phone,
        location=profile.location,
        education=profile.education,
        experience_years=profile.experience_years or 0,
        linkedin_url=profile.linkedin_url,
        github_url=profile.github_url,
        portfolio_url=profile.portfolio_url,
        profile_completion=profile.profile_completion,
        skills=[CandidateSkillResponse.model_validate(s) for s in skills],
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )
    return response_data

@router.get("/skills", response_model=List[CandidateSkillResponse])
def get_candidate_skills(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate)
):
    """Get list of candidate skills."""
    skills = CandidateService.get_skills(db=db, user=current_user)
    return [CandidateSkillResponse.model_validate(s) for s in skills]

@router.post("/skills", response_model=CandidateSkillResponse, status_code=status.HTTP_201_CREATED)
def add_candidate_skill(
    skill_in: CandidateSkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate)
):
    """Add a new skill entry for the candidate."""
    skill = CandidateService.add_skill(db=db, user=current_user, skill_in=skill_in)
    return CandidateSkillResponse.model_validate(skill)

@router.put("/skills/{skill_id}", response_model=CandidateSkillResponse)
def update_candidate_skill(
    skill_id: int,
    skill_in: CandidateSkillUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate)
):
    """Update an existing skill entry."""
    skill = CandidateService.update_skill(db=db, user=current_user, skill_id=skill_id, skill_in=skill_in)
    return CandidateSkillResponse.model_validate(skill)

@router.delete("/skills/{skill_id}")
def delete_candidate_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate)
):
    """Delete a skill entry from candidate profile."""
    return CandidateService.delete_skill(db=db, user=current_user, skill_id=skill_id)
