from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.recruiter import RecruiterProfile
from app.models.company import Company
from app.schemas.recruiter import RecruiterProfileUpdate
from app.schemas.company import CompanyCreate, CompanyUpdate

class RecruiterService:

    @classmethod
    def get_or_create_profile(cls, db: Session, user: User) -> RecruiterProfile:
        """Retrieves recruiter profile or initializes a new default record for the recruiter user."""
        profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user.id).first()
        if not profile:
            profile = RecruiterProfile(
                user_id=user.id,
                phone=user.phone,
                designation=user.headline or "Talent Acquisition Specialist",
                company_id=None
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)

        return profile

    @classmethod
    def update_profile(cls, db: Session, user: User, profile_in: RecruiterProfileUpdate) -> RecruiterProfile:
        """Updates recruiter profile details."""
        profile = cls.get_or_create_profile(db, user)

        update_data = profile_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(profile, field, value)

        db.commit()
        db.refresh(profile)
        return profile

    @classmethod
    def get_company(cls, db: Session, user: User) -> Company | None:
        """Gets company associated with the current recruiter's profile."""
        profile = cls.get_or_create_profile(db, user)
        if not profile.company_id:
            return None
        return db.query(Company).filter(Company.id == profile.company_id).first()

    @classmethod
    def create_company(cls, db: Session, user: User, company_in: CompanyCreate) -> Company:
        """Creates a new company and associates it with the recruiter's profile."""
        profile = cls.get_or_create_profile(db, user)
        
        # Check if recruiter already manages a company
        if profile.company_id:
            existing_company = db.query(Company).filter(Company.id == profile.company_id).first()
            if existing_company:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="You are already associated with a company profile. Update existing company instead."
                )

        new_company = Company(
            name=company_in.name,
            description=company_in.description,
            website=company_in.website,
            location=company_in.location,
            industry=company_in.industry,
            company_size=company_in.company_size
        )
        db.add(new_company)
        db.commit()
        db.refresh(new_company)

        # Associate with recruiter
        profile.company_id = new_company.id
        db.commit()
        db.refresh(profile)

        return new_company

    @classmethod
    def update_company(cls, db: Session, user: User, company_in: CompanyUpdate) -> Company:
        """Updates the company details associated with the recruiter's profile."""
        profile = cls.get_or_create_profile(db, user)
        if not profile.company_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No company profile found for this recruiter. Please create a company profile first."
            )

        company = db.query(Company).filter(Company.id == profile.company_id).first()
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company record not found."
            )

        update_data = company_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(company, field, value)

        db.commit()
        db.refresh(company)
        return company
