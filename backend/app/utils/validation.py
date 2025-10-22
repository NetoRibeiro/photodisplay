import re
from typing import Any, Dict
from fastapi import HTTPException, status
from pydantic import BaseModel, validator


def sanitize_string(value: str, max_length: int = 1000) -> str:
    """Sanitize string input"""
    if not isinstance(value, str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid input type"
        )
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\']', '', value)
    
    # Limit length
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized.strip()


def validate_user_id(user_id: str) -> str:
    """Validate user ID format"""
    if not user_id or not isinstance(user_id, str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    # Allow alphanumeric, hyphens, underscores, dots
    if not re.match(r'^[a-zA-Z0-9._-]+$', user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User ID contains invalid characters"
        )
    
    if len(user_id) > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User ID too long"
        )
    
    return user_id


def validate_photo_id(photo_id: str) -> str:
    """Validate photo ID format (UUID)"""
    if not photo_id or not isinstance(photo_id, str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid photo ID"
        )
    
    # UUID pattern
    uuid_pattern = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    if not re.match(uuid_pattern, photo_id, re.IGNORECASE):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid photo ID format"
        )
    
    return photo_id


def validate_coordinates(lat: float, lon: float) -> tuple[float, float]:
    """Validate latitude and longitude coordinates"""
    if not isinstance(lat, (int, float)) or not isinstance(lon, (int, float)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Coordinates must be numbers"
        )
    
    if not (-90 <= lat <= 90):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Latitude must be between -90 and 90"
        )
    
    if not (-180 <= lon <= 180):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Longitude must be between -180 and 180"
        )
    
    return float(lat), float(lon)


class SecureBaseModel(BaseModel):
    """Base model with security validations"""
    
    @validator('*', pre=True)
    def sanitize_strings(cls, v):
        if isinstance(v, str):
            return sanitize_string(v)
        return v
