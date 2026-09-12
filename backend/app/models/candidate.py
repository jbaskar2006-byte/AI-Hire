import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from app.database import Base

class SkillLevelEnum(str, enum.Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"
    EXPERT = "Expert"

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    phone = Column(String(30), nullable=True)
    location = Column(String(150), nullable=True)
    education = Column(String(255), nullable=True)
    experience_years = Column(Integer, default=0, nullable=False)
    linkedin_url = Column(String(255), nullable=True)
    github_url = Column(String(255), nullable=True)
    portfolio_url = Column(String(255), nullable=True)
    profile_completion = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="candidate_profile")
    skills = relationship("CandidateSkill", back_populates="candidate", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="candidate", cascade="all, delete-orphan")
    scores = relationship("CandidateScore", back_populates="candidate", cascade="all, delete-orphan")
    interview_questions = relationship("InterviewQuestion", back_populates="candidate", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<CandidateProfile(id={self.id}, user_id={self.user_id}, completion={self.profile_completion}%)>"


class CandidateSkill(Base):
    __tablename__ = "candidate_skills"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String(100), nullable=False)
    skill_level = Column(SQLEnum(SkillLevelEnum), default=SkillLevelEnum.INTERMEDIATE, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationship
    candidate = relationship("CandidateProfile", back_populates="skills")

    def __repr__(self):
        return f"<CandidateSkill(id={self.id}, name='{self.skill_name}', level='{self.skill_level}')>"
