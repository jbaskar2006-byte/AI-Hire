from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, UserUpdate, PasswordChange, TokenResponse, UserResponse
from app.schemas.token import MessageResponse
from app.utils.security import verify_password, hash_password
from app.utils.jwt import create_access_token

class AuthService:
    
    @staticmethod
    def register_user(db: Session, user_in: UserRegister) -> TokenResponse:
        """Register a new user account and generate JWT token with user_id, email, role, and expiration."""
        if user_in.role not in ["candidate", "recruiter"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user role"
            )

        existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        hashed_pwd = hash_password(user_in.password)
        
        new_user = User(
            name=user_in.name,
            email=user_in.email.lower(),
            password_hash=hashed_pwd,
            role=user_in.role,
            company=user_in.company,
            headline=user_in.headline,
            phone=user_in.phone
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Auto-create profile record depending on role
        if new_user.role == "candidate":
            from app.services.candidate_service import CandidateService
            CandidateService.get_or_create_profile(db, new_user)
        elif new_user.role == "recruiter":
            from app.services.recruiter_service import RecruiterService
            RecruiterService.get_or_create_profile(db, new_user)
        
        access_token = create_access_token(
            user_id=new_user.id,
            email=new_user.email,
            role=new_user.role
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(new_user)
        )

    @staticmethod
    def authenticate_user(db: Session, user_in: UserLogin) -> TokenResponse:
        """Authenticate user credentials and generate JWT token with user_id, email, role, and expiration."""
        user = db.query(User).filter(User.email == user_in.email.lower()).first()
        if not user or not verify_password(user_in.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This user account has been deactivated."
            )
            
        access_token = create_access_token(
            user_id=user.id,
            email=user.email,
            role=user.role
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )

    @staticmethod
    def update_user_profile(db: Session, current_user: User, user_update: UserUpdate) -> UserResponse:
        """Update current user profile details."""
        update_data = user_update.model_dump(exclude_unset=True)
        if "full_name" in update_data and "name" not in update_data:
            update_data["name"] = update_data.pop("full_name")
            
        for field, value in update_data.items():
            setattr(current_user, field, value)
            
        db.commit()
        db.refresh(current_user)
        return UserResponse.model_validate(current_user)

    @staticmethod
    def change_user_password(db: Session, current_user: User, pwd_data: PasswordChange) -> MessageResponse:
        """Verify current password and set new password_hash."""
        if not verify_password(pwd_data.current_password, current_user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect."
            )
            
        current_user.password_hash = hash_password(pwd_data.new_password)
        db.commit()
        return MessageResponse(message="Password updated successfully.")
