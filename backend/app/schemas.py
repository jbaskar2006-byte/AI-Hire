from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field

# Base User Schema
class UserBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, example="Alex Johnson")
    email: EmailStr = Field(..., example="alex@hireai.com")
    role: Literal["recruiter", "candidate", "admin"] = Field("candidate", example="recruiter")
    company: Optional[str] = Field(None, example="Tech Corp")
    headline: Optional[str] = Field(None, example="Senior Talent Acquisition Lead")
    phone: Optional[str] = Field(None, example="+1 (555) 019-2831")

# Registration Schema
class UserCreate(UserBase):
    password: str = Field(..., min_length=6, example="Password123!")

# Login Schema
class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="recruiter@hireai.com")
    password: str = Field(..., example="password123")

# Profile Update Schema
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    company: Optional[str] = None
    headline: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

# Password Change Schema
class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

# User Response Output Schema
class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Token Response
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Token Data Payload
class TokenData(BaseModel):
    sub: Optional[str] = None  # user email
    role: Optional[str] = None
    user_id: Optional[int] = None

# Standard Generic Message Response
class MessageResponse(BaseModel):
    message: str
    success: bool = True
