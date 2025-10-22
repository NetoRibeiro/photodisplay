#!/bin/bash

# Photo Display Platform - Local Setup Script
# This script helps set up the application for local development

set -e

echo "🚀 Photo Display Platform - Local Setup"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "backend/pyproject.toml" ] || [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql+asyncpg://photodisplay_user:password@localhost:5432/photodisplay

# JWT Configuration (REQUIRED - must be at least 32 characters)
JWT_SECRET=local-development-jwt-secret-key-minimum-32-characters-long
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Storage Configuration
STORAGE_BUCKET=photodisplay-local-bucket
STORAGE_REGION=us-central1
SIGNED_URL_TTL_SECONDS=3600

# Google OAuth Configuration (optional for local dev)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
GOOGLE_PHOTOS_SCOPES=https://www.googleapis.com/auth/photoslibrary.readonly

# Security Configuration
MAX_FILE_SIZE_MB=25
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# Application Configuration
PROJECT_NAME=Photo Display API
API_PREFIX=/api
EOF
    echo "✅ Created .env file with default values"
    echo "⚠️  Please update the DATABASE_URL with your actual PostgreSQL credentials"
else
    echo "✅ .env file already exists"
fi

# Setup backend
echo "🐍 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -e .

echo "✅ Backend setup complete"

# Setup frontend
echo "📦 Setting up frontend..."
cd ../frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete"

# Return to root directory
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up PostgreSQL database (see LOCAL_SETUP.md for details)"
echo "2. Update .env file with your database credentials"
echo "3. Run the application:"
echo "   - Backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo "The application will be available at:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend API: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo ""
echo "For detailed instructions, see LOCAL_SETUP.md"
