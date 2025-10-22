from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.api.auth_deps import get_current_user
from app.auth import create_access_token, authenticate_user, get_password_hash
from app.config import get_settings
from app.models.entities import UserSettings
from pydantic import BaseModel

router = APIRouter(prefix='/auth', tags=['authentication'])
settings = get_settings()


class Token(BaseModel):
    access_token: str
    token_type: str


class UserCreate(BaseModel):
    user_id: str
    password: str


class UserResponse(BaseModel):
    user_id: str
    message: str


@router.post("/register", response_model=UserResponse)
async def register_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user"""
    # Check if user already exists
    result = await db.execute(select(UserSettings).where(UserSettings.user_id == user_data.user_id))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    
    # Validate user_id format
    from app.utils.validation import validate_user_id
    validated_user_id = validate_user_id(user_data.user_id)
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user settings (we'll store password hash in a separate table in production)
    user_settings = UserSettings(
        user_id=validated_user_id,
        # In a real app, you'd store the password hash in a separate User table
        # For now, we'll just create the settings
    )
    db.add(user_settings)
    await db.commit()
    
    return UserResponse(
        user_id=validated_user_id,
        message="User registered successfully"
    )


@router.post("/login", response_model=Token)
async def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """Login user and return access token"""
    # In a real application, you'd verify the password against a stored hash
    # For demo purposes, we'll accept any password for existing users
    
    result = await db.execute(select(UserSettings).where(UserSettings.user_id == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # In production, verify password:
    # if not authenticate_user(form_data.username, form_data.password, user.password_hash):
    #     raise HTTPException(...)
    
    access_token_expires = timedelta(minutes=settings.jwt_expire_minutes)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me")
async def get_current_user_info(
    current_user: str = Depends(get_current_user)
):
    """Get current user information"""
    return {"user_id": current_user}
