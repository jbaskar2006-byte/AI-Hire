from typing import Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_recruiter
from app.models.user import User
from app.schemas.recruiter import RecruiterProfileUpdate, RecruiterProfileResponse
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse
from app.services.recruiter_service import RecruiterService

router = APIRouter(prefix="/recruiter", tags=["Recruiter & Company Management"])

@router.get("/profile", response_model=RecruiterProfileResponse)
def get_recruiter_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter)
):
    """
    Get Recruiter Profile information. Restricted to recruiter role.
    """
    profile = RecruiterService.get_or_create_profile(db=db, user=current_user)
    company = RecruiterService.get_company(db=db, user=current_user)

    company_resp = CompanyResponse.model_validate(company) if company else None

    return RecruiterProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        full_name=current_user.name,
        email=current_user.email,
        phone=profile.phone or current_user.phone,
        designation=profile.designation,
        company_id=profile.company_id,
        company=company_resp,
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

@router.put("/profile", response_model=RecruiterProfileResponse)
def update_recruiter_profile(
    profile_in: RecruiterProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter)
):
    """
    Update Recruiter Profile details.
    """
    profile = RecruiterService.update_profile(db=db, user=current_user, profile_in=profile_in)
    company = RecruiterService.get_company(db=db, user=current_user)
    company_resp = CompanyResponse.model_validate(company) if company else None

    return RecruiterProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        full_name=current_user.name,
        email=current_user.email,
        phone=profile.phone or current_user.phone,
        designation=profile.designation,
        company_id=profile.company_id,
        company=company_resp,
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

@router.get("/company", response_model=Optional[CompanyResponse])
def get_recruiter_company(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter)
):
    """
    Get Company details managed by recruiter. Returns null if company is not created yet.
    """
    company = RecruiterService.get_company(db=db, user=current_user)
    if not company:
        return None
    return CompanyResponse.model_validate(company)

@router.post("/company", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_recruiter_company(
    company_in: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter)
):
    """
    Create a new Company record and link it to the recruiter's profile.
    """
    company = RecruiterService.create_company(db=db, user=current_user, company_in=company_in)
    return CompanyResponse.model_validate(company)

@router.put("/company", response_model=CompanyResponse)
def update_recruiter_company(
    company_in: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter)
):
    """
    Update details of the company associated with the recruiter's profile.
    """
    company = RecruiterService.update_company(db=db, user=current_user, company_in=company_in)
    return CompanyResponse.model_validate(company)
