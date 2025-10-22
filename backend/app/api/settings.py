from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.api.auth_deps import get_current_user
from app.models.entities import UserSettings as UserSettingsModel
from app.schemas import UserSettings as UserSettingsSchema, UserSettingsUpdate

router = APIRouter(prefix='/settings', tags=['settings'])


def to_schema(model: UserSettingsModel) -> UserSettingsSchema:
  return UserSettingsSchema(
    userId=model.user_id,
    detailOnly=model.detail_only,
    slideshowIntervalSec=model.slideshow_interval_sec,
    updatedAt=model.updated_at or datetime.utcnow()
  )


@router.get('/', response_model=UserSettingsSchema)
async def get_settings(
  db: AsyncSession = Depends(get_db),
  current_user: str = Depends(get_current_user)
):
  """Get user settings for the authenticated user"""
  result = await db.execute(select(UserSettingsModel).where(UserSettingsModel.user_id == current_user))
  settings = result.scalar_one_or_none()
  if not settings:
    # Create default settings if none exist
    settings = UserSettingsModel(user_id=current_user)
    db.add(settings)
    await db.commit()
    await db.refresh(settings)
  return to_schema(settings)


@router.patch('/', response_model=UserSettingsSchema)
async def update_settings(
  payload: UserSettingsUpdate,
  db: AsyncSession = Depends(get_db),
  current_user: str = Depends(get_current_user)
):
  """Update user settings for the authenticated user"""
  result = await db.execute(select(UserSettingsModel).where(UserSettingsModel.user_id == current_user))
  settings = result.scalar_one_or_none()
  if not settings:
    settings = UserSettingsModel(user_id=current_user)
    db.add(settings)

  if payload.detailOnly is not None:
    settings.detail_only = payload.detailOnly
  if payload.slideshowIntervalSec is not None:
    settings.slideshow_interval_sec = payload.slideshowIntervalSec
  settings.updated_at = datetime.utcnow()
  await db.commit()
  await db.refresh(settings)
  return to_schema(settings)
