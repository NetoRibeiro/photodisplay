#!/usr/bin/env python3
"""
Photo Display Platform - Health Check Script
This script tests if the application is running correctly locally.
"""

import requests
import json
import sys
import time

def test_backend_health():
    """Test backend health endpoint"""
    try:
        response = requests.get("http://localhost:8000/healthz", timeout=5)
        if response.status_code == 200:
            print("✅ Backend health check passed")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend not accessible: {e}")
        return False

def test_frontend():
    """Test frontend accessibility"""
    try:
        response = requests.get("http://localhost:5173", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend accessible")
            return True
        else:
            print(f"❌ Frontend not accessible: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Frontend not accessible: {e}")
        return False

def test_api_docs():
    """Test API documentation"""
    try:
        response = requests.get("http://localhost:8000/docs", timeout=5)
        if response.status_code == 200:
            print("✅ API documentation accessible")
            return True
        else:
            print(f"❌ API documentation not accessible: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ API documentation not accessible: {e}")
        return False

def test_auth_endpoint():
    """Test authentication endpoint"""
    try:
        # Test registration endpoint
        response = requests.post(
            "http://localhost:8000/api/auth/register",
            json={"user_id": "test_user", "password": "test_password"},
            timeout=5
        )
        if response.status_code in [200, 400]:  # 400 is OK if user already exists
            print("✅ Authentication endpoint working")
            return True
        else:
            print(f"❌ Authentication endpoint failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Authentication endpoint not accessible: {e}")
        return False

def main():
    """Run all health checks"""
    print("🔍 Photo Display Platform - Health Check")
    print("=" * 50)
    
    checks = [
        ("Backend Health", test_backend_health),
        ("Frontend", test_frontend),
        ("API Documentation", test_api_docs),
        ("Authentication", test_auth_endpoint),
    ]
    
    passed = 0
    total = len(checks)
    
    for name, test_func in checks:
        print(f"\n📋 Testing {name}...")
        if test_func():
            passed += 1
        time.sleep(1)  # Small delay between tests
    
    print("\n" + "=" * 50)
    print(f"📊 Results: {passed}/{total} checks passed")
    
    if passed == total:
        print("🎉 All systems operational!")
        print("\n🌐 Access your application:")
        print("  - Frontend: http://localhost:5173")
        print("  - Backend API: http://localhost:8000")
        print("  - API Docs: http://localhost:8000/docs")
        return 0
    else:
        print("⚠️  Some checks failed. Please check the logs above.")
        print("\n🔧 Troubleshooting:")
        print("  1. Ensure all services are running")
        print("  2. Check that ports 8000 and 5173 are not in use")
        print("  3. Verify your .env configuration")
        print("  4. Check the console logs for errors")
        return 1

if __name__ == "__main__":
    sys.exit(main())
