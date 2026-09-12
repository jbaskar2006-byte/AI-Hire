from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.candidate import CandidateProfile, CandidateSkill
from app.schemas.candidate import CandidateProfileUpdate, CandidateSkillCreate, CandidateSkillUpdate

class CandidateService:

    @staticmethod
    def calculate_profile_completion(profile: CandidateProfile, skills_count: int) -> int:
        """
        Dynamically calculates profile completion percentage based on 8 key profile fields:
        1. Phone
        2. Location
        3. Education
        4. Experience Years (> 0)
        5. Skills (at least 1 skill added)
        6. LinkedIn URL
        7. GitHub URL
        8. Portfolio URL
        
        Example: 6 of 8 completed = 75%
        """
        total_fields = 8
        completed_fields = 0

        if profile.phone and profile.phone.strip():
            completed_fields += 1
        if profile.location and profile.location.strip():
            completed_fields += 1
        if profile.education and profile.education.strip():
            completed_fields += 1
        if profile.experience_years is not None and profile.experience_years > 0:
            completed_fields += 1
        if skills_count > 0:
            completed_fields += 1
        if profile.linkedin_url and profile.linkedin_url.strip():
            completed_fields += 1
        if profile.github_url and profile.github_url.strip():
            completed_fields += 1
        if profile.portfolio_url and profile.portfolio_url.strip():
            completed_fields += 1

        percentage = int((completed_fields / total_fields) * 100)
        return percentage

    @classmethod
    def get_or_create_profile(cls, db: Session, user: User) -> CandidateProfile:
        """Retrieves candidate profile or initializes a new default record for the user."""
        profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == user.id).first()
        if not profile:
            profile = CandidateProfile(
                user_id=user.id,
                phone=user.phone,
                location=None,
                education=None,
                experience_years=0,
                linkedin_url=None,
                github_url=None,
                portfolio_url=None,
                profile_completion=0
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)

        # Recalculate completion score
        skills_count = db.query(CandidateSkill).filter(CandidateSkill.candidate_id == profile.id).count()
        completion_score = cls.calculate_profile_completion(profile, skills_count)
        if profile.profile_completion != completion_score:
            profile.profile_completion = completion_score
            db.commit()

        return profile

    @classmethod
    def update_profile(cls, db: Session, user: User, profile_in: CandidateProfileUpdate) -> CandidateProfile:
        """Updates candidate profile fields and recalculates profile completion percentage."""
        profile = cls.get_or_create_profile(db, user)

        update_data = profile_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(profile, field, value)

        skills_count = db.query(CandidateSkill).filter(CandidateSkill.candidate_id == profile.id).count()
        profile.profile_completion = cls.calculate_profile_completion(profile, skills_count)

        db.commit()
        db.refresh(profile)
        return profile

    @classmethod
    def get_skills(cls, db: Session, user: User) -> list[CandidateSkill]:
        """Returns all skills associated with candidate profile."""
        profile = cls.get_or_create_profile(db, user)
        return db.query(CandidateSkill).filter(CandidateSkill.candidate_id == profile.id).all()

    @classmethod
    def add_skill(cls, db: Session, user: User, skill_in: CandidateSkillCreate) -> CandidateSkill:
        """Adds a new skill entry for candidate and updates profile completion percentage."""
        profile = cls.get_or_create_profile(db, user)

        # Check duplicate skill
        existing = db.query(CandidateSkill).filter(
            CandidateSkill.candidate_id == profile.id,
            CandidateSkill.skill_name.ilike(skill_in.skill_name.strip())
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Skill '{skill_in.skill_name}' is already added."
            )

        new_skill = CandidateSkill(
            candidate_id=profile.id,
            skill_name=skill_in.skill_name.strip(),
            skill_level=skill_in.skill_level
        )
        db.add(new_skill)
        db.commit()
        db.refresh(new_skill)

        # Recalculate profile completion
        skills_count = db.query(CandidateSkill).filter(CandidateSkill.candidate_id == profile.id).count()
        profile.profile_completion = cls.calculate_profile_completion(profile, skills_count)
        db.commit()

        return new_skill

    @classmethod
    def update_skill(cls, db: Session, user: User, skill_id: int, skill_in: CandidateSkillUpdate) -> CandidateSkill:
        """Updates skill entry for candidate."""
        profile = cls.get_or_create_profile(db, user)
        skill = db.query(CandidateSkill).filter(
            CandidateSkill.id == skill_id,
            CandidateSkill.candidate_id == profile.id
        ).first()

        if not skill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skill entry not found."
            )

        update_data = skill_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(skill, field, value)

        db.commit()
        db.refresh(skill)
        return skill

    @classmethod
    def delete_skill(cls, db: Session, user: User, skill_id: int) -> dict:
        """Deletes skill entry and updates candidate profile completion percentage."""
        profile = cls.get_or_create_profile(db, user)
        skill = db.query(CandidateSkill).filter(
            CandidateSkill.id == skill_id,
            CandidateSkill.candidate_id == profile.id
        ).first()

        if not skill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skill entry not found."
            )

        db.delete(skill)
        db.commit()

        # Recalculate profile completion
        skills_count = db.query(CandidateSkill).filter(CandidateSkill.candidate_id == profile.id).count()
        profile.profile_completion = cls.calculate_profile_completion(profile, skills_count)
        db.commit()

        return {"message": "Skill deleted successfully", "success": True}
