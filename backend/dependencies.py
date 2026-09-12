from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.jwt import decode_access_token
from app.models.user import User

security = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    FastAPI authentication dependency for protected routes.
    Extracts HTTP Authorization Bearer token, validates claims (user_id, email, role, exp),
    and loads the authenticated user record from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not credentials:
        raise credentials_exception

    token = credentials.credentials
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: int = payload.get("user_id")
    email: str = payload.get("email") or payload.get("sub")
    
    if user_id is None and email is None:
        raise credentials_exception
        
    user = None
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
    if not user and email:
        user = db.query(User).filter(User.email == email).first()
        
    if user is None:
        raise credentials_exception
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated."
        )
        
    return user

def require_candidate(current_user: User = Depends(get_current_user)) -> User:
    """
    Role-based authorization guard restricting endpoint access strictly to candidates.
    Returns HTTP 403 Forbidden if user role is not candidate or admin.
    """
    if current_user.role != "candidate" and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Candidate role required"
        )
    return current_user

def require_recruiter(current_user: User = Depends(get_current_user)) -> User:
    """
    Role-based authorization guard restricting endpoint access strictly to recruiters.
    Returns HTTP 403 Forbidden if user role is not recruiter or admin.
    """
    if current_user.role != "recruiter" and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Recruiter role required"
        )
    return current_user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Role-based authorization guard restricting endpoint access strictly to admins.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Admin role required"
        )
    return current_user

def require_roles(allowed_roles: List[str]):
    """
    Generic role-based authorization dependency guard.
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid user role"
            )
        return current_user
    return role_checker
