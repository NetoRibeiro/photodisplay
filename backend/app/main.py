from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.config import get_settings
from app.api import photos, settings as settings_api, auth
from app.middleware.security import RateLimitMiddleware, SecurityHeadersMiddleware, RequestLoggingMiddleware


def create_app() -> FastAPI:
  settings = get_settings()
  app = FastAPI(title=settings.project_name)
  
  # Security middleware (order matters!)
  app.add_middleware(SecurityHeadersMiddleware)
  app.add_middleware(RateLimitMiddleware)
  app.add_middleware(RequestLoggingMiddleware)
  
  # Trusted host middleware
  app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["localhost", "127.0.0.1", "*.yourdomain.com"]
  )
  
  # CORS middleware with proper configuration
  app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
    expose_headers=["X-Total-Count"]
  )
  
  # Compression middleware
  app.add_middleware(GZipMiddleware, minimum_size=1000)

  app.include_router(auth.router, prefix=settings.api_prefix)
  app.include_router(photos.router, prefix=settings.api_prefix)
  app.include_router(settings_api.router, prefix=settings.api_prefix)

  @app.get('/healthz')
  async def healthz():
    return {'status': 'ok', 'version': '1.0.0'}

  return app


app = create_app()
