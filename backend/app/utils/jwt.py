import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from app.config import settings

def create_access_token(
    user_id: int,
    email: str,
    role: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Generates a signed JWT access token containing required claims:
    - user_id: Database integer ID
    - email: User's email address
    - role: User's assigned role ('candidate', 'recruiter', 'admin')
    - exp: Token expiration timestamp
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload: Dict[str, Any] = {
        "user_id": user_id,
        "email": email,
        "sub": email,
        "role": role,
        "exp": expire,
        "iat": datetime.utcnow()
    }

    encoded_jwt = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodes and validates a JWT access token using JWT_SECRET and JWT_ALGORITHM.
    Returns the payload dictionary if valid, None if expired or invalid.
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
