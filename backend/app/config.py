from functools import lru_cache
from pathlib import Path
from pydantic import Field, validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

# Find project root (go up from backend/app/config.py to project root)
PROJECT_ROOT = Path(__file__).parent.parent.parent
ENV_FILE = PROJECT_ROOT / '.env'


class Settings(BaseSettings):
  model_config = SettingsConfigDict(env_file=str(ENV_FILE), env_file_encoding='utf-8', extra='ignore')

  project_name: str = 'Photo Display API'
  api_prefix: str = '/api'
  cors_origins: str = Field(default='http://localhost:3000,http://localhost:5173', description='Comma-separated list of allowed origins')
  database_url: str = 'postgresql+asyncpg://user:pass@localhost:5432/photos'
  storage_bucket: str = 'photodisplay-bucket'
  storage_region: str = 'us-central1'
  google_client_id: str = 'GOOGLE_CLIENT_ID'
  google_client_secret: str = 'GOOGLE_CLIENT_SECRET'
  google_redirect_uri: str = 'http://localhost:3000/auth/google/callback'
  google_photos_scopes: str = 'https://www.googleapis.com/auth/photoslibrary.readonly'
  jwt_secret: str = Field(..., min_length=32, description='JWT secret key (minimum 32 characters)')
  jwt_algorithm: str = 'HS256'
  jwt_expire_minutes: int = 30
  signed_url_ttl_seconds: int = 3600
  
  # Security settings
  max_file_size_mb: int = 25
  allowed_file_types: List[str] = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  rate_limit_requests: int = 100
  rate_limit_window: int = 60  # seconds
  
  @validator('cors_origins')
  def parse_cors_origins(cls, v):
    if v == '*':
      raise ValueError('CORS origins cannot be "*" in production. Specify exact origins.')
    return [origin.strip() for origin in v.split(',') if origin.strip()]
  
  @validator('jwt_secret')
  def validate_jwt_secret(cls, v):
    if len(v) < 32:
      raise ValueError('JWT secret must be at least 32 characters')
    return v


@lru_cache
def get_settings() -> Settings:
  return Settings()
