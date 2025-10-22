# Photo Display Platform - Local Setup Guide

## Prerequisites

Before running the application, ensure you have:

- **Python 3.11+** installed
- **Node.js 18+** and npm installed
- **PostgreSQL** database running locally
- **Git** for cloning the repository

## Quick Start

### 1. Database Setup

First, create a PostgreSQL database:

```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE photodisplay;
CREATE USER photodisplay_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE photodisplay TO photodisplay_user;
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```bash
# Database Configuration
DATABASE_URL=postgresql+asyncpg://photodisplay_user:your_password@localhost:5432/photodisplay

# JWT Configuration (REQUIRED - must be at least 32 characters)
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-chars-local-dev
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Storage Configuration (for local development)
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
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -e .

# Run database migrations (create tables)
# You can run the SQL from db_schema.sql manually or use Alembic
psql -U photodisplay_user -d photodisplay -f ../db_schema.sql

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: `http://localhost:8000`

### 4. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`

### 5. Verify Installation

1. **Backend Health Check**: Visit `http://localhost:8000/healthz`
2. **API Documentation**: Visit `http://localhost:8000/docs`
3. **Frontend**: Visit `http://localhost:5173`

## Testing the Application

### 1. Register a User
- Visit `http://localhost:5173`
- Click "Create Account"
- Enter a username and password
- Click "Create Account"

### 2. Login
- Use your credentials to login
- You should see the photo gallery interface

### 3. Upload Photos
- Click "Upload" button
- Select image files (JPEG, PNG, WebP, GIF)
- Files will be processed asynchronously

### 4. Test API Endpoints
Visit `http://localhost:8000/docs` to test API endpoints directly.

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: connection to server at "localhost" (127.0.0.1), port 5432 failed
```
**Solution**: Ensure PostgreSQL is running and credentials are correct.

#### 2. JWT Secret Error
```
ValueError: JWT secret must be at least 32 characters
```
**Solution**: Update your `.env` file with a longer JWT secret.

#### 3. CORS Error
```
Access to fetch at 'http://localhost:8000/api/photos' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution**: Ensure `http://localhost:5173` is in your `CORS_ORIGINS` environment variable.

#### 4. File Upload Error
```
File type image/jpeg not allowed
```
**Solution**: Check that your file validation is working correctly.

### Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **API Testing**: Use the Swagger UI at `http://localhost:8000/docs`
3. **Database**: Use a tool like pgAdmin or DBeaver to manage your PostgreSQL database
4. **Logs**: Check console output for detailed error messages

## Production Considerations

For production deployment:

1. **Use a production database** (not local PostgreSQL)
2. **Set up proper file storage** (AWS S3, Google Cloud Storage)
3. **Configure HTTPS**
4. **Use environment-specific configurations**
5. **Set up monitoring and logging**

## Need Help?

If you encounter issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that PostgreSQL is running and accessible
5. Verify ports 8000 and 5173 are not in use by other applications

The application should now be running locally with full security features enabled!
