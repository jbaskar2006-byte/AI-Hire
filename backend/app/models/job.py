import datetime
import enum
from sqlalchemy import Column, Integer, String, Text, Numeric, Date, DateTime, ForeignKey, Enum as SQLEnum, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class JobStatusEnum(str, enum.Enum):
    ACTIVE = "active"
    CLOSED = "closed"
    DRAFT = "draft"

class JobTypeEnum(str, enum.Enum):
    FULL_TIME = "Full Time"
    PART_TIME = "Part Time"
    INTERNSHIP = "Internship"
    REMOTE = "Remote"
    HYBRID = "Hybrid"

class SkillTypeEnum(str, enum.Enum):
    REQUIRED = "required"
    PREFERRED = "preferred"

class ApplicationStatusEnum(str, enum.Enum):
    APPLIED = "Applied"
    UNDER_REVIEW = "Under Review"
    SHORTLISTED = "Shortlisted"
    INTERVIEW = "Interview"
    REJECTED = "Rejected"
    SELECTED = "Selected"


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    recruiter_id = Column(Integer, ForeignKey("recruiter_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(150), nullable=False)
    job_type = Column(SQLEnum(JobTypeEnum), default=JobTypeEnum.FULL_TIME, nullable=False)
    min_experience = Column(Integer, default=0, nullable=False)
    salary_min = Column(Numeric(12, 2), nullable=True)
    salary_max = Column(Numeric(12, 2), nullable=True)
    deadline = Column(Date, nullable=True)
    status = Column(SQLEnum(JobStatusEnum), default=JobStatusEnum.ACTIVE, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationships
    recruiter = relationship("RecruiterProfile", back_populates="jobs")
    company = relationship("Company", back_populates="jobs")
    skills = relationship("JobSkill", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    scores = relationship("CandidateScore", back_populates="job", cascade="all, delete-orphan")
    interview_questions = relationship("InterviewQuestion", back_populates="job", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Job(id={self.id}, title='{self.title}', status='{self.status}')>"


class JobSkill(Base):
    __tablename__ = "job_skills"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String(100), nullable=False)
    skill_type = Column(SQLEnum(SkillTypeEnum), default=SkillTypeEnum.REQUIRED, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationship
    job = relationship("Job", back_populates="skills")

    def __repr__(self):
        return f"<JobSkill(id={self.id}, name='{self.skill_name}', type='{self.skill_type}')>"


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(SQLEnum(ApplicationStatusEnum), default=ApplicationStatusEnum.APPLIED, nullable=False)
    applied_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("candidate_id", "job_id", name="uq_candidate_job"),
    )

    # Relationships
    candidate = relationship("CandidateProfile", back_populates="applications")
    job = relationship("Job", back_populates="applications")

    def __repr__(self):
        return f"<Application(id={self.id}, candidate_id={self.candidate_id}, job_id={self.job_id}, status='{self.status}')>"
