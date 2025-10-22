from sqlalchemy import Boolean, Column, DateTime, Integer, JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.models.database import Base


class Photo(Base):
  __tablename__ = 'photos'

  id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  user_id = Column(String, index=True, nullable=False)
  storage_key = Column(String, nullable=False)
  variants = Column(JSON, nullable=False, default=list)
  caption_ai = Column(Text)
  note_user = Column(Text)
  exif = Column(JSON, nullable=False, default=dict)
  place_auto = Column(JSON)
  place_display = Column(JSON)
  location_override = Column(JSON)
  status = Column(String, nullable=False, default='processing')
  created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
  updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


class UserSettings(Base):
  __tablename__ = 'user_settings'

  user_id = Column(String, primary_key=True)
  detail_only = Column(Boolean, default=False)
  slideshow_interval_sec = Column(Integer, default=5)
  updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
