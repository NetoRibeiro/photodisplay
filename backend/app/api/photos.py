from datetime import datetime
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.models.entities import Photo
from app.queues.events import JobType, QueueManager
from app.schemas import Photo as PhotoSchema, PhotoUpdateLocation, PhotoUpdateNote

router = APIRouter(prefix='/photos', tags=['photos'])
queue_manager = QueueManager()


def to_schema(photo: Photo) -> PhotoSchema:
  return PhotoSchema(
    id=str(photo.id),
    userId=photo.user_id,
    storageKey=photo.storage_key,
    variants=photo.variants or [],
    captionAi=photo.caption_ai,
    noteUser=photo.note_user,
    exif=photo.exif or {},
    placeAuto=photo.place_auto,
    placeDisplay=photo.place_display,
    locationOverride=photo.location_override,
    createdAt=photo.created_at or datetime.utcnow(),
    updatedAt=photo.updated_at or datetime.utcnow(),
    status=photo.status
  )


@router.get('/', response_model=list[PhotoSchema])
async def list_photos(user_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(
    select(Photo).where(Photo.user_id == user_id).order_by(Photo.created_at.desc())
  )
  photos = result.scalars().all()
  return [to_schema(photo) for photo in photos]


@router.get('/{photo_id}', response_model=PhotoSchema)
async def get_photo(photo_id: str, user_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(Photo).where(Photo.id == photo_id, Photo.user_id == user_id))
  photo = result.scalars().first()
  if not photo:
    raise HTTPException(status_code=404, detail='Photo not found')
  return to_schema(photo)


@router.patch('/{photo_id}/note', response_model=PhotoSchema)
async def update_note(photo_id: str, payload: PhotoUpdateNote, user_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(Photo).where(Photo.id == photo_id, Photo.user_id == user_id))
  photo = result.scalar_one_or_none()
  if not photo:
    raise HTTPException(status_code=404, detail='Photo not found')
  photo.note_user = payload.note
  photo.updated_at = datetime.utcnow()
  await db.commit()
  await db.refresh(photo)
  return to_schema(photo)


@router.patch('/{photo_id}/location', response_model=PhotoSchema)
async def update_location(photo_id: str, payload: PhotoUpdateLocation, user_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(Photo).where(Photo.id == photo_id, Photo.user_id == user_id))
  photo = result.scalar_one_or_none()
  if not photo:
    raise HTTPException(status_code=404, detail='Photo not found')

  override = {'type': payload.type}
  if payload.label:
    override['label'] = payload.label
  if payload.lat is not None and payload.lon is not None:
    override['lat'] = payload.lat
    override['lon'] = payload.lon
  override['source'] = 'user'

  photo.location_override = override
  photo.place_display = override if payload.label else photo.place_auto
  photo.updated_at = datetime.utcnow()
  await db.commit()
  await db.refresh(photo)
  return to_schema(photo)


@router.delete('/{photo_id}/location/override', response_model=PhotoSchema)
async def clear_override(photo_id: str, user_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(Photo).where(Photo.id == photo_id, Photo.user_id == user_id))
  photo = result.scalar_one_or_none()
  if not photo:
    raise HTTPException(status_code=404, detail='Photo not found')
  photo.location_override = None
  if photo.place_auto:
    photo.place_display = photo.place_auto
  photo.updated_at = datetime.utcnow()
  await db.commit()
  await db.refresh(photo)
  return to_schema(photo)


@router.post('/upload', status_code=202)
async def upload_photos(
  files: list[UploadFile] = File(default=[]),
  user_id: str = Form(...),
  db: AsyncSession = Depends(get_db)
):
  if not files:
    raise HTTPException(status_code=400, detail='No files uploaded')

  for file in files:
    photo = Photo(
      user_id=user_id,
      storage_key=f'{user_id}/{file.filename}',
      variants=['256', '1024', '2048'],
      exif={'hasGps': False},
      status='processing'
    )
    db.add(photo)
    await db.flush()
    queue_manager.enqueue({'type': JobType.DERIVATIVE, 'photo_id': str(photo.id)})
    queue_manager.enqueue({'type': JobType.EXIF, 'photo_id': str(photo.id)})
    queue_manager.enqueue({'type': JobType.CAPTION, 'photo_id': str(photo.id)})

  await db.commit()
  return {'message': 'Upload accepted', 'jobs': queue_manager.drain()}
