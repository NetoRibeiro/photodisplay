from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
  model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

  project_name: str = 'Photo Display API'
  api_prefix: str = '/api'
  cors_origins: str = '*'
  database_url: str = 'postgresql+asyncpg://user:pass@localhost:5432/photos'
  storage_bucket: str = 'photodisplay-bucket'
  storage_region: str = 'us-central1'
  google_client_id: str = 'GOOGLE_CLIENT_ID'
  google_client_secret: str = 'GOOGLE_CLIENT_SECRET'
  google_redirect_uri: str = 'http://localhost:3000/auth/google/callback'
  google_photos_scopes: str = 'https://www.googleapis.com/auth/photoslibrary.readonly'
  jwt_secret: str = 'change-me'
  signed_url_ttl_seconds: int = 3600


@lru_cache
def get_settings() -> Settings:
  return Settings()
