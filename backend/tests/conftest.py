import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import get_settings

@pytest.fixture
def client():
    # Override settings for testing if needed
    settings = get_settings()
    # Ensure we have a valid secret for tests
    if len(settings.jwt_secret) < 32:
        settings.jwt_secret = "test_secret_key_must_be_at_least_32_chars_long"
    
    with TestClient(app) as c:
        yield c
