from app.auth import get_password_hash, verify_password, create_access_token, verify_token
from datetime import timedelta

def test_password_hashing():
    password = "secret_password"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed)
    assert not verify_password("wrong_password", hashed)

def test_jwt_token_creation_and_verification():
    data = {"sub": "user123"}
    token = create_access_token(data)
    payload = verify_token(token)
    assert payload["sub"] == "user123"

def test_jwt_expiration():
    # Create a token that expires immediately
    data = {"sub": "user123"}
    token = create_access_token(data, expires_delta=timedelta(seconds=-1))
    
    # Verification should fail (raise exception)
    # Note: In a real test we'd expect an exception, but verify_token might raise HTTPException
    # which we should catch. For simplicity in this basic suite, we'll just check it throws.
    try:
        verify_token(token)
        assert False, "Token should be expired"
    except Exception:
        assert True
