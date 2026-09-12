import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import validates, relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="candidate")  # candidate, recruiter, admin
    company = Column(String(255), nullable=True)
    headline = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationships (uselist=False for 1-to-1 relationship)
    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    recruiter_profile = relationship("RecruiterProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")

    @validates("role")
    def validate_role(self, key, role_value):
        """ORM validation enforcing role options: candidate, recruiter, admin."""
        allowed_roles = {"candidate", "recruiter", "admin"}
        if role_value not in allowed_roles:
            raise ValueError(f"Invalid role '{role_value}'. Role must be one of: {', '.join(allowed_roles)}")
        return role_value

    @property
    def full_name(self):
        """Backward compatibility helper property."""
        return self.name

    def __repr__(self):
        return f"<User(id={self.id}, name='{self.name}', email='{self.email}', role='{self.role}')>"
