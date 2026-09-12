import datetime
import enum
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.database import Base

class AnalysisStatusEnum(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(Integer, nullable=False)
    extracted_text = Column(Text, nullable=True)
    analysis_status = Column(
        SQLEnum(AnalysisStatusEnum, values_callable=lambda x: [e.value for e in x]),
        default=AnalysisStatusEnum.COMPLETED,
        nullable=False
    )
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationships
    candidate = relationship("CandidateProfile", back_populates="resumes")
    extracted_skills = relationship("ResumeExtractedSkill", back_populates="resume", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Resume(id={self.id}, original='{self.original_filename}', status='{self.analysis_status}')>"


class ResumeExtractedSkill(Base):
    __tablename__ = "resume_extracted_skills"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String(100), nullable=False, index=True)
    confidence = Column(Float, default=1.0, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationship
    resume = relationship("Resume", back_populates="extracted_skills")

    def __repr__(self):
        return f"<ResumeExtractedSkill(id={self.id}, skill='{self.skill_name}', confidence={self.confidence})>"
