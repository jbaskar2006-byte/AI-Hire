import datetime
import enum
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.database import Base

class QuestionCategoryEnum(str, enum.Enum):
    TECHNICAL = "Technical"
    HR = "HR"
    PROJECT = "Project"
    SKILL_BASED = "Skill-Based"

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(
        SQLEnum(QuestionCategoryEnum, values_callable=lambda x: [e.value for e in x]),
        default=QuestionCategoryEnum.TECHNICAL,
        nullable=False,
        index=True
    )
    question = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationships
    candidate = relationship("CandidateProfile", back_populates="interview_questions")
    job = relationship("Job", back_populates="interview_questions")

    def __repr__(self):
        return f"<InterviewQuestion(id={self.id}, category='{self.category}', candidate_id={self.candidate_id}, job_id={self.job_id})>"
