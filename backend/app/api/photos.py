from datetime import datetime
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.api.auth_deps import get_current_user
from app.models.entities import Photo
from app.queues.events import JobType, QueueManager
from app.schemas import Photo as PhotoSchema, PhotoUpdateLocation, PhotoUpdateNote
from app.utils.file_validation import validate_upload_file
from app.utils.validation import validate_user_id, validate_photo_id
import uuid

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
async def list_photos(
  db: AsyncSession = Depends(get_db),
  current_user: str = Depends(get_current_user)
):
  """List photos for the authenticated user"""
  result = await db.execute(
    select(Photo).where(Photo.user_id == current_user).order_by(Photo.created_at.desc())
  )
  photos = result.scalars().all()
  return [to_schema(photo) for photo in photos]


@router.get('/{photo_id}', response_model=PhotoSchema)
async def get_photo(
  photo_id: str, 
  db: AsyncSession = Depends(get_db),
  current_user: str = Depends(get_current_user)
):
  """Get a specific photo for the authenticated user"""
  validate_photo_id(photo_id)
  
  result = await db.execute(
    select(Photo).where(Photo.id == photo_id, Photo.user_id == current_user)
  )
  photo = result.scalars().first()
  if not photo:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND, 
      detail='Photo not found'
    )
  return to_schema(photo)


@router.patch('/{photo_id}/note', response_model=PhotoSchema)
async def update_note(
  photo_id: str, 
  payload: PhotoUpdateNote, 
  db: AsyncSession = Depends(get_db),
  current_user: str = Depends(get_current_user)
):
  """Update note for a photo"""
  validate_photo_id(photo_id)
  
  result = await db.execute(
    select(Photo).where(Photo.id == photo_id, Photo.user_id == current_user)
  )
  photo = result.scalar_one_or_none()
  if not photo:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND, 
      detail='Photo not found'
    )
  
  photo.note_user = payload.note
  photo.updated_at = datetime.utcnow()
  await db.commit()
  await db.refresh(photo)
  return to_schema(photo)


@router.patch('/{photo_id}/location', response_model=PhotoSchema)
async def update_location(
  photo_id: str, 
  payload: PhotoUpdateLocation, 
  db: AsyncSession = Depends(get_db),
  current_user: str = Depends(get_current_user)
):
  """Update location for a photo"""
  validate_photo_id(photo_id)
  
  result = await db.execute(
    select(Photo).where(Photo.id == photo_id, Photo.user_id == current_user)
  )
  photo = result.scalar_one_or_none()
  if not photo:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND, 
      detail='Photo not found'
    )

  override = {'type': payload.type}
  if payload.label:
    override['label'] = payload.label
  if payload.lat is not None and payload.lon is not None:
    from app.utils.validation import validate_coordinates
    lat, lon = validate_coordinates(payload.lat, payload.lon)
    override['lat'] = lat
    override['lon'] = lon
  override['source'] = 'user'

  photo.location_override = override
  photo.place_display = override if payload.label else photo.place_auto
  photo.updated_at = datetime.utcnow()
  await db.commit()
  await db.refresh(photo)
  return to_schema(photo)


@router.delete('/{photo_id}/location/override', response_model=PhotoSchema)
async def clear_override(
  photo_id: str, 
  db: AsyncSession = Depends(get_db),
  current_user: str = Depends(get_current_user)
):
  """Clear location override for a photo"""
  validate_photo_id(photo_id)
  
  result = await db.execute(
    select(Photo).where(Photo.id == photo_id, Photo.user_id == current_user)
  )
  photo = result.scalar_one_or_none()
  if not photo:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND, 
      detail='Photo not found'
    )
  
  photo.location_override = None
  if photo.place_auto:
    photo.place_display = photo.place_auto
  photo.updated_at = datetime.utcnow()
  await db.commit()
  await db.refresh(photo)
  return to_schema(photo)


@router.post('/upload', status_code=status.HTTP_202_ACCEPTED)
async def upload_photos(
  files: list[UploadFile] = File(default=[]),
  db: AsyncSession = Depends(get_db),
  current_user: str = Depends(get_current_user)
):
  """Upload photos with comprehensive validation"""
  if not files:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST, 
      detail='No files uploaded'
    )
  
  if len(files) > 10:  # Limit number of files per request
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail='Too many files. Maximum 10 files per request.'
    )

  uploaded_photos = []
  
  for file in files:
    try:
      # Validate file
      validate_upload_file(file)
      
      # Generate secure filename
      file_extension = file.filename.split('.')[-1].lower()
      secure_filename = f"{uuid.uuid4()}.{file_extension}"
      
      photo = Photo(
        user_id=current_user,
        storage_key=f'{current_user}/{secure_filename}',
        variants=['256', '1024', '2048'],
        exif={'hasGps': False},
        status='processing'
      )
      db.add(photo)
      await db.flush()
      
      # Enqueue processing jobs
      queue_manager.enqueue({'type': JobType.DERIVATIVE, 'photo_id': str(photo.id)})
      queue_manager.enqueue({'type': JobType.EXIF, 'photo_id': str(photo.id)})
      queue_manager.enqueue({'type': JobType.CAPTION, 'photo_id': str(photo.id)})
      
      uploaded_photos.append(str(photo.id))
      
    except HTTPException:
      raise
    except Exception as e:
      raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f'Error processing file {file.filename}: {str(e)}'
      )

  await db.commit()
  return {
    'message': 'Upload accepted', 
    'photos': uploaded_photos,
    'jobs': queue_manager.drain()
  }
