@echo off
REM Photo Display Platform - Local Setup Script for Windows
REM This script helps set up the application for local development

echo 🚀 Photo Display Platform - Local Setup
echo ======================================

REM Check if we're in the right directory
if not exist "backend\pyproject.toml" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

REM Check prerequisites
echo 📋 Checking prerequisites...

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.11+
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    pause
    exit /b 1
)

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Check if .env file exists
if not exist ".env" (
    echo 📝 Creating .env file...
    (
        echo # Database Configuration
        echo DATABASE_URL=postgresql+asyncpg://photodisplay_user:password@localhost:5432/photodisplay
        echo.
        echo # JWT Configuration ^(REQUIRED - must be at least 32 characters^)
        echo JWT_SECRET=local-development-jwt-secret-key-minimum-32-characters-long
        echo JWT_ALGORITHM=HS256
        echo JWT_EXPIRE_MINUTES=30
        echo.
        echo # CORS Configuration
        echo CORS_ORIGINS=http://localhost:3000,http://localhost:5173
        echo.
        echo # Storage Configuration
        echo STORAGE_BUCKET=photodisplay-local-bucket
        echo STORAGE_REGION=us-central1
        echo SIGNED_URL_TTL_SECONDS=3600
        echo.
        echo # Google OAuth Configuration ^(optional for local dev^)
        echo GOOGLE_CLIENT_ID=your-google-client-id
        echo GOOGLE_CLIENT_SECRET=your-google-client-secret
        echo GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
        echo GOOGLE_PHOTOS_SCOPES=https://www.googleapis.com/auth/photoslibrary.readonly
        echo.
        echo # Security Configuration
        echo MAX_FILE_SIZE_MB=25
        echo RATE_LIMIT_REQUESTS=100
        echo RATE_LIMIT_WINDOW=60
        echo.
        echo # Application Configuration
        echo PROJECT_NAME=Photo Display API
        echo API_PREFIX=/api
    ) > .env
    echo ✅ Created .env file with default values
    echo ⚠️  Please update the DATABASE_URL with your actual PostgreSQL credentials
) else (
    echo ✅ .env file already exists
)

REM Setup backend
echo 🐍 Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
echo Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -e .

echo ✅ Backend setup complete

REM Setup frontend
echo 📦 Setting up frontend...
cd ..\frontend

REM Install dependencies
echo Installing Node.js dependencies...
npm install

echo ✅ Frontend setup complete

REM Return to root directory
cd ..

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Set up PostgreSQL database ^(see LOCAL_SETUP.md for details^)
echo 2. Update .env file with your database credentials
echo 3. Run the application:
echo    - Backend: cd backend ^&^& venv\Scripts\activate ^&^& uvicorn app.main:app --reload
echo    - Frontend: cd frontend ^&^& npm run dev
echo.
echo The application will be available at:
echo   - Frontend: http://localhost:5173
echo   - Backend API: http://localhost:8000
echo   - API Docs: http://localhost:8000/docs
echo.
echo For detailed instructions, see LOCAL_SETUP.md
pause
