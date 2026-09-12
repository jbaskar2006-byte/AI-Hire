from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field, model_validator

# 1. User Registration Schema (Public)
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, example="Sarah Connor")
    email: EmailStr = Field(..., example="recruiter@hireai.com")
    password: str = Field(
        ..., 
        min_length=6, 
        max_length=128, 
        description="Password must be at least 6 characters long",
        example="password123"
    )
    role: Literal["candidate", "recruiter"] = Field(
        "candidate",
        description="Public registration role. Admin registration is forbidden publicly.",
        example="recruiter"
    )
    company: Optional[str] = Field(None, example="Apex Global Tech")
    headline: Optional[str] = Field(None, example="Senior Talent Acquisition Lead")
    phone: Optional[str] = Field(None, example="+1 (555) 019-2831")

    @model_validator(mode="before")
    def accept_full_name_alias(cls, values):
        if isinstance(values, dict):
            if ("name" not in values or not values.get("name")) and values.get("full_name"):
                values["name"] = values["full_name"]
        return values

# Alias for backward compatibility
UserCreate = UserRegister

# 2. User Login Schema
class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="recruiter@hireai.com")
    password: str = Field(..., min_length=1, example="password123")

# 3. User Response Schema
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    company: Optional[str] = None
    headline: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# 4. Token Response Schema
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Alias for backward compatibility
Token = TokenResponse

# 5. Profile Update Schema
class UserUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    headline: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

# 6. Password Change Schema
class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

# 7. Generic Message Response Schema
class MessageResponse(BaseModel):
    message: str
    success: bool = True
