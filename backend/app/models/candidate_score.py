import datetime
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class CandidateScore(Base):
    __tablename__ = "candidate_scores"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_score = Column(Float, default=0.0, nullable=False)
    experience_score = Column(Float, default=0.0, nullable=False)
    education_score = Column(Float, default=0.0, nullable=False)
    similarity_score = Column(Float, default=0.0, nullable=False)
    final_score = Column(Float, default=0.0, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("candidate_id", "job_id", name="uq_candidate_job_score"),
    )

    # Relationships
    candidate = relationship("CandidateProfile", back_populates="scores")
    job = relationship("Job", back_populates="scores")

    def __repr__(self):
        return f"<CandidateScore(candidate_id={self.candidate_id}, job_id={self.job_id}, final_score={self.final_score})>"
