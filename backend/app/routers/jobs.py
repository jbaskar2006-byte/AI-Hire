from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user, require_recruiter
from app.models.user import User
from app.models.recruiter import RecruiterProfile
from app.models.candidate import CandidateProfile
from app.schemas.job import JobCreate, JobUpdate, JobResponse, JobListResponse
from app.services import job_service
from app.utils.jwt import decode_access_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer(auto_error=False)

router = APIRouter(prefix="/jobs", tags=["Job Management"])

def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not credentials:
        return None
    try:
        payload = decode_access_token(credentials.credentials)
        if not payload:
            return None
        user_id = payload.get("user_id")
        if user_id:
            return db.query(User).filter(User.id == user_id).first()
    except Exception:
        pass
    return None

@router.get("", response_model=JobListResponse)
def list_jobs(
    search: Optional[str] = Query(None, description="Search term for title, description, or company name"),
    location: Optional[str] = Query(None, description="Filter by location"),
    job_type: Optional[str] = Query(None, description="Filter by job type"),
    skill: Optional[str] = Query(None, description="Filter by required/preferred skill name"),
    min_experience: Optional[int] = Query(None, description="Filter by maximum required experience"),
    recruiter_id: Optional[int] = Query(None, description="Filter by recruiter ID"),
    status: Optional[str] = Query(None, description="Filter by job status"),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    current_cand_id = None
    if current_user and current_user.role == "candidate":
        cand_prof = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
        if cand_prof:
            current_cand_id = cand_prof.id

    return job_service.list_jobs(
        db=db,
        search=search,
        location=location,
        job_type=job_type,
        skill=skill,
        min_experience=min_experience,
        recruiter_id=recruiter_id,
        status=status,
        page=page,
        size=size,
        current_candidate_id=current_cand_id
    )

@router.get("/{job_id}", response_model=JobResponse)
def get_job_by_id(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    job = job_service.get_job_by_id(db=db, job_id=job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    current_cand_id = None
    if current_user and current_user.role == "candidate":
        cand_prof = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
        if cand_prof:
            current_cand_id = cand_prof.id

    return job_service.format_job_response(db=db, job=job, current_candidate_id=current_cand_id)

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    job_in: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter)
):
    # Retrieve recruiter profile
    recruiter_prof = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not recruiter_prof:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recruiter profile not found. Please complete your recruiter profile first."
        )
    if not recruiter_prof.company_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must create or link a Company profile before posting a job."
        )

    job = job_service.create_job(
        db=db,
        recruiter_id=recruiter_prof.id,
        company_id=recruiter_prof.company_id,
        job_in=job_in
    )
    return job_service.format_job_response(db=db, job=job)

@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_in: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter)
):
    job = job_service.get_job_by_id(db=db, job_id=job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    recruiter_prof = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not recruiter_prof or job.recruiter_id != recruiter_prof.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only manage your own posted jobs."
        )

    updated_job = job_service.update_job(db=db, job=job, job_in=job_in)
    return job_service.format_job_response(db=db, job=updated_job)

@router.delete("/{job_id}", status_code=status.HTTP_200_OK)
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter)
):
    job = job_service.get_job_by_id(db=db, job_id=job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    recruiter_prof = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not recruiter_prof or job.recruiter_id != recruiter_prof.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only manage your own posted jobs."
        )

    job_service.delete_job(db=db, job=job)
    return {"status": "success", "message": "Job deleted successfully"}
