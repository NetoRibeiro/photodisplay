# Photo Display Platform - Local Development

A secure, privacy-first photo display application with authentication, file validation, and comprehensive security features.

## 🚀 Quick Start

### Option 1: Using Setup Scripts (Recommended)

**For Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

**For Windows:**
```cmd
setup.bat
```

### Option 2: Using Docker Compose (Easiest)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: Manual Setup

Follow the detailed instructions in [LOCAL_SETUP.md](LOCAL_SETUP.md)

## 🔧 Prerequisites

- **Python 3.11+**
- **Node.js 18+** and npm
- **PostgreSQL 12+** (or use Docker)
- **Git**

## 📋 What's Included

### Security Features
- ✅ JWT Authentication
- ✅ File Upload Validation
- ✅ Input Sanitization
- ✅ Rate Limiting
- ✅ Security Headers
- ✅ CORS Protection
- ✅ SQL Injection Prevention

### Application Features
- ✅ Photo Gallery
- ✅ User Authentication
- ✅ File Upload
- ✅ EXIF Processing
- ✅ AI Captioning
- ✅ Location Services
- ✅ Slideshow Mode
- ✅ Responsive Design

## 🌐 Access Points

After starting the application:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/healthz

## 🔐 Default Credentials

The application uses JWT authentication. You can:

1. **Register** a new account through the web interface
2. **Login** with your credentials
3. **Upload** photos securely

## 📁 Project Structure

```
photodisplay/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── auth.py         # Authentication
│   │   ├── config.py       # Configuration
│   │   ├── middleware/     # Security middleware
│   │   └── utils/          # Utilities
│   └── pyproject.toml      # Python dependencies
├── frontend/               # Preact frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   └── routes/         # Page routes
│   └── package.json        # Node dependencies
├── workers/                # Background workers
├── docker-compose.yml      # Docker setup
├── setup.sh               # Linux/macOS setup script
├── setup.bat              # Windows setup script
└── LOCAL_SETUP.md         # Detailed setup guide
```

## 🛠️ Development Commands

### Backend
```bash
cd backend
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate     # Windows

uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm run dev
```

### Database
```bash
# Create database
createdb photodisplay

# Run migrations
psql -d photodisplay -f db_schema.sql
```

## 🔍 Testing

### API Testing
Visit http://localhost:8000/docs to test API endpoints interactively.

### Frontend Testing
```bash
cd frontend
npm test
```

### E2E Testing
```bash
# Install Cypress
npm install -g cypress

# Run tests
cd e2e
cypress run
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check credentials in `.env` file
   - Verify database exists

2. **JWT Secret Error**
   - Ensure JWT_SECRET is at least 32 characters
   - Check `.env` file configuration

3. **CORS Error**
   - Verify CORS_ORIGINS includes your frontend URL
   - Check browser console for specific errors

4. **File Upload Error**
   - Ensure file is under 25MB
   - Check file type is supported (JPEG, PNG, WebP, GIF)
   - Verify authentication token

### Getting Help

1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that required ports are not in use

## 📚 Documentation

- [LOCAL_SETUP.md](LOCAL_SETUP.md) - Detailed setup instructions
- [SECURITY.md](SECURITY.md) - Security implementation details
- [API Documentation](http://localhost:8000/docs) - Interactive API docs

## 🚀 Production Deployment

For production deployment:

1. **Use production database** (not local PostgreSQL)
2. **Set up proper file storage** (AWS S3, Google Cloud Storage)
3. **Configure HTTPS**
4. **Use environment-specific configurations**
5. **Set up monitoring and logging**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy coding! 🎉**

The Photo Display Platform is now ready for local development with comprehensive security features enabled.
