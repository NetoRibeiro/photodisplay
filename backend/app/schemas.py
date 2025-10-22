from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field
from pydantic.config import ConfigDict


class PhotoBase(BaseModel):
  model_config = ConfigDict(populate_by_name=True, json_encoders={datetime: lambda v: v.isoformat()})

  userId: str = Field(alias='userId')
  storageKey: str
  variants: list[str]
  captionAi: Optional[str] = Field(default=None, max_length=240)
  noteUser: Optional[str] = Field(default=None, max_length=240)
  exif: dict
  placeAuto: Optional[dict] = None
  placeDisplay: Optional[dict] = None
  locationOverride: Optional[dict] = None
  status: Literal['processing', 'ready', 'error']


class Photo(PhotoBase):
  id: str
  createdAt: datetime = Field(alias='createdAt')
  updatedAt: datetime = Field(alias='updatedAt')


class PhotoUpdateNote(BaseModel):
  note: str = Field(min_length=0, max_length=240)


class PhotoUpdateLocation(BaseModel):
  type: Literal['label', 'coords']
  label: Optional[str] = Field(default=None, max_length=240)
  lat: Optional[float]
  lon: Optional[float]


class UserSettings(BaseModel):
  model_config = ConfigDict(populate_by_name=True, json_encoders={datetime: lambda v: v.isoformat()})

  userId: str
  detailOnly: bool
  slideshowIntervalSec: int = Field(ge=3, le=300)
  updatedAt: datetime


class UserSettingsUpdate(BaseModel):
  detailOnly: Optional[bool]
  slideshowIntervalSec: Optional[int] = Field(default=None, ge=3, le=300)
