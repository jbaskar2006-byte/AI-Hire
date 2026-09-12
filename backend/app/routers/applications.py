from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_candidate, require_recruiter
from app.models.user import User
from app.models.candidate import CandidateProfile
from app.models.recruiter import RecruiterProfile
from app.schemas.application import ApplicationResponse, ApplicationStatusUpdate
from app.services import application_service

router = APIRouter(prefix="/applications", tags=["Job Applications"])

@router.post("/{job_id}", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_for_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate)
):
    cand_prof = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not cand_prof:
        # Create default candidate profile if missing
        cand_prof = CandidateProfile(user_id=current_user.id)
        db.add(cand_prof)
        db.commit()
        db.refresh(cand_prof)

    return application_service.apply_for_job(db=db, candidate_id=cand_prof.id, job_id=job_id)

@router.get("/my", response_model=List[ApplicationResponse])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate)
):
    cand_prof = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not cand_prof:
        return []

    return application_service.get_candidate_applications(db=db, candidate_id=cand_prof.id)

@router.delete("/{application_id}", status_code=status.HTTP_200_OK)
def withdraw_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate)
):
    cand_prof = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not cand_prof:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found"
        )

    application_service.withdraw_application(
        db=db, candidate_id=cand_prof.id, application_id=application_id
    )
    return {"status": "success", "message": "Application withdrawn successfully"}

@router.get("/job/{job_id}", response_model=List[ApplicationResponse])
def get_applications_for_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter)
):
    recruiter_prof = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not recruiter_prof:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recruiter profile not found"
        )

    return application_service.get_job_applications(
        db=db, job_id=job_id, recruiter_id=recruiter_prof.id
    )

@router.put("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    status_in: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter)
):
    recruiter_prof = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not recruiter_prof:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recruiter profile not found"
        )

    return application_service.update_application_status(
        db=db,
        application_id=application_id,
        recruiter_id=recruiter_prof.id,
        new_status=status_in.status
    )
