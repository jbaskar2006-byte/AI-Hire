from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import (
    UserRegister, UserLogin, UserResponse, TokenResponse,
    UserUpdate, PasswordChange, MessageResponse
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    """
    Public User Registration Endpoint (Candidate & Recruiter).
    
    Process:
    1. Input Validation (Pydantic UserRegister)
    2. Check Email Uniqueness in Database
    3. Hash Password (12-round bcrypt)
    4. Save User Record in MySQL
    5. Return JWT Token + User Response
    """
    return AuthService.register_user(db=db, user_in=user_in)

@router.post("/login", response_model=TokenResponse)
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    """
    Public User Login Endpoint.
    
    Process:
    1. Receive Email + Password
    2. Find User in MySQL Database by Email
    3. Verify Password against Bcrypt Hash
    4. Generate JWT Token (user_id, email, role, exp)
    5. Return Token + User Response
    """
    return AuthService.authenticate_user(db=db, user_in=user_in)

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Protected Route: Get Currently Authenticated User.
    
    Requires JWT Bearer Authentication.
    Returns: id, name, email, role, and profile details.
    """
    return UserResponse.model_validate(current_user)

@router.put("/profile", response_model=UserResponse)
def update_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Protected Route: Update current user profile information."""
    return AuthService.update_user_profile(db=db, current_user=current_user, user_update=user_update)

@router.post("/change-password", response_model=MessageResponse)
def change_password(
    pwd_data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Protected Route: Change current user password."""
    return AuthService.change_user_password(db=db, current_user=current_user, pwd_data=pwd_data)
