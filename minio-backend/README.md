# File Storage API

A robust and scalable file storage API built with NestJS and MinIO, following Clean Architecture principles and modern development practices.

## 🚀 Features

- **File Upload & Management**: Upload, retrieve, list, and delete files
- **MinIO Integration**: Scalable object storage with presigned URLs
- **Clean Architecture**: Well-structured codebase following SOLID principles
- **Comprehensive Validation**: Input validation with class-validator
- **Error Handling**: Centralized error handling with custom exceptions
- **API Documentation**: Auto-generated Swagger documentation
- **Security**: Helmet, CORS, rate limiting, and file validation
- **Logging**: Structured logging with request/response tracking
- **Testing**: Comprehensive unit and e2e tests
- **Type Safety**: Full TypeScript support with strict typing

## 📁 Project Structure

```
src/
├── common/                 # Shared utilities and components
│   ├── constants/         # Application constants
│   ├── decorators/        # Custom decorators
│   ├── exceptions/        # Custom exception classes
│   ├── filters/           # Exception filters
│   ├── interceptors/      # Request/response interceptors
│   └── pipes/             # Validation pipes
├── config/                # Configuration management
│   ├── app.config.ts      # Application configuration
│   └── storage.config.ts  # Storage configuration
├── modules/               # Feature modules
│   ├── files/             # File management module
│   │   ├── controllers/   # REST controllers
│   │   ├── services/      # Business logic
│   │   ├── dto/           # Data transfer objects
│   │   ├── entities/      # Domain entities
│   │   └── interfaces/    # Module interfaces
│   └── storage/           # Storage abstraction module
│       ├── providers/     # Storage provider implementations
│       └── interfaces/    # Storage contracts
└── shared/                # Shared domain logic
    ├── interfaces/        # Common interfaces
    ├── types/             # Type definitions
    └── utils/             # Utility functions
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure your environment variables
# Edit .env file with your MinIO settings
```

## 🔧 Environment Variables

```env
# Application
PORT=3000
NODE_ENV=development
API_PREFIX=api/v1
CORS_ORIGINS=http://localhost:3000

# MinIO Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=uploads
MINIO_REGION=us-east-1
```

## 🐳 Docker Setup

Start MinIO using Docker Compose:

```bash
docker-compose up -d
```

This will start MinIO on:
- API: http://localhost:9000
- Console: http://localhost:9001

## 🚀 Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at:
- **API**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/api/v1/docs

## 📚 API Endpoints

### Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/files/upload` | Upload a file |
| GET | `/api/v1/files` | List files (paginated) |
| GET | `/api/v1/files/:id` | Get file by ID |
| DELETE | `/api/v1/files/:id` | Delete file |

### Example Usage

```bash
# Upload a file
curl -X POST \
  http://localhost:3000/api/v1/files/upload \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/your/file.jpg' \
  -F 'description=Profile picture' \
  -F 'tags=profile,image'

# List files
curl http://localhost:3000/api/v1/files?page=1&limit=10&search=profile

# Get file by ID
curl http://localhost:3000/api/v1/files/123e4567-e89b-12d3-a456-426614174000

# Delete file
curl -X DELETE http://localhost:3000/api/v1/files/123e4567-e89b-12d3-a456-426614174000
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🔍 Code Quality

```bash
# Linting
npm run lint

# Format code
npm run format

# Build
npm run build
```

## 🏗️ Architecture Principles

### Clean Architecture
- **Separation of Concerns**: Each layer has a single responsibility
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Interface Segregation**: Clients depend only on interfaces they use

### SOLID Principles
- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for base types
- **Interface Segregation**: Many specific interfaces are better than one general
- **Dependency Inversion**: Depend on abstractions, not concretions

### Design Patterns
- **Repository Pattern**: Data access abstraction
- **Strategy Pattern**: Pluggable storage providers
- **Factory Pattern**: Object creation abstraction
- **Observer Pattern**: Event-driven architecture

## 🔒 Security Features

- **File Validation**: MIME type and size validation
- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for HTTP responses
- **Input Validation**: Comprehensive request validation
- **Error Sanitization**: Prevents information leakage

## 📊 Monitoring & Logging

- **Structured Logging**: JSON-formatted logs with context
- **Request Tracking**: Automatic request/response logging
- **Error Tracking**: Comprehensive error logging with stack traces
- **Performance Monitoring**: Request duration tracking

## 🚀 Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Configure proper MinIO credentials
3. Set up SSL/TLS certificates
4. Configure reverse proxy (nginx/Apache)
5. Set up monitoring and logging
6. Configure backup strategies
7. Set up health checks

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [MinIO](https://min.io/) - High-performance object storage
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Swagger](https://swagger.io/) - API documentation