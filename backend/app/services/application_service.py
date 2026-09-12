from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import exc
from fastapi import HTTPException, status
from app.models.job import Job, Application, ApplicationStatusEnum, JobStatusEnum
from app.models.candidate import CandidateProfile
from app.models.user import User
from app.schemas.application import ApplicationResponse, CandidateSummaryResponse
from app.services.job_service import format_job_response

def apply_for_job(db: Session, candidate_id: int, job_id: int) -> ApplicationResponse:
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    if job.status != JobStatusEnum.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot apply to an inactive or closed job"
        )

    # Check for existing application
    existing_app = db.query(Application).filter(
        Application.candidate_id == candidate_id,
        Application.job_id == job_id
    ).first()
    if existing_app:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied for this job"
        )

    application = Application(
        candidate_id=candidate_id,
        job_id=job_id,
        status=ApplicationStatusEnum.APPLIED
    )
    db.add(application)
    try:
        db.commit()
        db.refresh(application)
    except exc.IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied for this job"
        )

    return format_application_response(db, application)

def get_candidate_applications(db: Session, candidate_id: int) -> List[ApplicationResponse]:
    apps = db.query(Application).filter(
        Application.candidate_id == candidate_id
    ).order_by(Application.applied_at.desc()).all()

    return [format_application_response(db, app) for app in apps]

def withdraw_application(db: Session, candidate_id: int, application_id: int) -> None:
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    if app.candidate_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized to withdraw this application"
        )

    db.delete(app)
    db.commit()

def get_job_applications(db: Session, job_id: int, recruiter_id: int) -> List[ApplicationResponse]:
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    if job.recruiter_id != recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized to view applications for this job"
        )

    apps = db.query(Application).filter(
        Application.job_id == job_id
    ).order_by(Application.applied_at.desc()).all()

    return [format_application_response(db, app) for app in apps]

def update_application_status(
    db: Session, application_id: int, recruiter_id: int, new_status: ApplicationStatusEnum
) -> ApplicationResponse:
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    # Verify job ownership
    job = db.query(Job).filter(Job.id == app.job_id).first()
    if not job or job.recruiter_id != recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized to manage status for this application"
        )

    app.status = new_status
    db.commit()
    db.refresh(app)

    return format_application_response(db, app)

def format_application_response(db: Session, app: Application) -> ApplicationResponse:
    job_resp = format_job_response(db, app.job, current_candidate_id=app.candidate_id) if app.job else None
    
    cand_resp = None
    if app.candidate:
        cand = app.candidate
        cand_user = db.query(User).filter(User.id == cand.user_id).first()
        cand_skills = [s.skill_name for s in cand.skills] if cand.skills else []
        cand_resp = CandidateSummaryResponse(
            id=cand.id,
            user_id=cand.user_id,
            name=cand_user.name if cand_user else "Candidate",
            email=cand_user.email if cand_user else "",
            phone=cand.phone,
            location=cand.location,
            education=cand.education,
            experience_years=cand.experience_years,
            skills=cand_skills,
            linkedin_url=cand.linkedin_url,
            github_url=cand.github_url,
            portfolio_url=cand.portfolio_url
        )

    return ApplicationResponse(
        id=app.id,
        candidate_id=app.candidate_id,
        job_id=app.job_id,
        status=app.status,
        applied_at=app.applied_at,
        updated_at=app.updated_at,
        job=job_resp,
        candidate=cand_resp
    )
