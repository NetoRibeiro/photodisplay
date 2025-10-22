from typing import AsyncIterator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_settings
from app.models.database import SessionLocal


async def get_db() -> AsyncIterator[AsyncSession]:
  async with SessionLocal() as session:
    yield session


def get_settings_dep():
  return get_settings()
