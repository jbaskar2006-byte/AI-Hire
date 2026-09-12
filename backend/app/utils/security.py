import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional
from app.config import settings

def hash_password(password: str) -> str:
    """
    Generates a secure 12-round bcrypt hash for the provided password.
    Truncates input string to 72 bytes max as per bcrypt spec.
    """
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt(rounds=12)
    hashed_bytes = bcrypt.hashpw(password_bytes, salt)
    return hashed_bytes.decode('utf-8')

# Alias for backward compatibility
get_password_hash = hash_password

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password string against a stored bcrypt hash.
    Returns True if match, False otherwise.
    """
    try:
        password_bytes = plain_password.encode('utf-8')[:72]
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Creates a signed JWT access token using JWT_SECRET and JWT_ALGORITHM."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decodes and validates a JWT access token."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
