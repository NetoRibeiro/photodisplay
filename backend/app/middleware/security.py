from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
import time
from collections import defaultdict
from typing import Dict, Tuple
from app.config import get_settings

settings = get_settings()


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware"""
    
    def __init__(self, app):
        super().__init__(app)
        self.requests: Dict[str, list] = defaultdict(list)
    
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean old requests outside the window
        window_start = current_time - settings.rate_limit_window
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip] 
            if req_time > window_start
        ]
        
        # Check if limit exceeded
        if len(self.requests[client_ip]) >= settings.rate_limit_requests:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded"}
            )
        
        # Add current request
        self.requests[client_ip].append(current_time)
        
        response = await call_next(request)
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to responses"""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # Remove server information
        if "server" in response.headers:
            del response.headers["server"]
        
        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log requests for security monitoring"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request
        print(f"Request: {request.method} {request.url.path} from {request.client.host}")
        
        response = await call_next(request)
        
        # Log response
        process_time = time.time() - start_time
        print(f"Response: {response.status_code} in {process_time:.3f}s")
        
        return response
