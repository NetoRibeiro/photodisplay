import magic
from fastapi import HTTPException, status, UploadFile
from PIL import Image
import io
from app.config import get_settings

settings = get_settings()


def validate_file_type(file: UploadFile) -> None:
    """Validate file type using python-magic"""
    if not file.content_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type could not be determined"
        )
    
    # Read first 1024 bytes for magic number detection
    file.file.seek(0)
    file_header = file.file.read(1024)
    file.file.seek(0)
    
    # Detect actual file type
    detected_type = magic.from_buffer(file_header, mime=True)
    
    if detected_type not in settings.allowed_file_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {detected_type} not allowed. Allowed types: {', '.join(settings.allowed_file_types)}"
        )


def validate_file_size(file: UploadFile) -> None:
    """Validate file size"""
    max_size = settings.max_file_size_mb * 1024 * 1024  # Convert MB to bytes
    
    # Get file size
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size: {settings.max_file_size_mb}MB"
        )


def validate_image_integrity(file: UploadFile) -> None:
    """Validate that the file is a valid image"""
    try:
        file.file.seek(0)
        image_data = file.file.read()
        file.file.seek(0)
        
        # Try to open with PIL
        image = Image.open(io.BytesIO(image_data))
        image.verify()  # Verify the image
        
        # Additional security check - ensure it's actually an image
        if image.format not in ['JPEG', 'PNG', 'WEBP', 'GIF']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image format"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or corrupted image file"
        )


def validate_upload_file(file: UploadFile) -> None:
    """Comprehensive file validation"""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided"
        )
    
    # Check filename for suspicious patterns
    suspicious_patterns = ['..', '/', '\\', '<', '>', ':', '"', '|', '?', '*']
    if any(pattern in file.filename for pattern in suspicious_patterns):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid filename"
        )
    
    validate_file_size(file)
    validate_file_type(file)
    validate_image_integrity(file)
