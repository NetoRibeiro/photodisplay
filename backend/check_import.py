import sys
try:
    from app.main import app
    print("Successfully imported app")
except ImportError as e:
    print(f"ImportError: {e}")
except Exception as e:
    print(f"Error: {e}")
