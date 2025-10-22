from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.api import photos, settings as settings_api


def create_app() -> FastAPI:
  settings = get_settings()
  app = FastAPI(title=settings.project_name)
  origins = [origin.strip() for origin in settings.cors_origins.split(',') if origin]
  app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
  )

  app.include_router(photos.router, prefix=settings.api_prefix)
  app.include_router(settings_api.router, prefix=settings.api_prefix)

  @app.get('/healthz')
  async def healthz():
    return {'status': 'ok'}

  return app


app = create_app()
