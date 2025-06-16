# JobQuest Platform

A scalable, clutter-free job aggregation platform with AI-powered CV analysis and curated job listings.

## 🚀 Features

- **Curated Job Listings**: Admin-managed job postings for private and government sectors
- **AI-Powered CV Analysis**: Instant feedback using Google Gemini API
- **Advanced Filtering**: Fast, intuitive filtering by category, location, batch, and skills
- **Suggested Jobs**: Personalized job recommendations based on CV analysis
- **Newsletter Subscriptions**: Category-specific job alerts via Mailchimp
- **Admin Panel**: Comprehensive management interface with bulk upload capabilities
- **SEO Optimized**: Built for search engine visibility and performance
- **Responsive Design**: Mobile-first approach with modern UI/UX

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: AWS DynamoDB (NoSQL)
- **Caching**: Redis (AWS ElastiCache)
- **File Storage**: AWS S3
- **Message Queue**: Apache Kafka
- **AI Integration**: Google Gemini API
- **Email Service**: Mailchimp
- **Push Notifications**: OneSignal

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js Web   │    │  Express API    │    │   DynamoDB      │
│   Application   │◄──►│   Server        │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │     Redis       │              │
         │              │     Cache       │              │
         │              └─────────────────┘              │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      AWS S3     │    │     Kafka       │    │   Gemini AI     │
│   File Storage  │    │ Message Queue   │    │      API        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
jobquest-platform/
├── packages/
│   ├── api/                 # Backend Express.js Application
│   │   ├── src/
│   │   │   ├── api/         # API routes and controllers
│   │   │   ├── services/    # External service integrations
│   │   │   ├── jobs/        # Background job processors
│   │   │   └── middleware/  # Authentication and validation
│   │   ├── .env.example     # Environment variables template
│   │   └── package.json
│   │
│   └── web/                 # Frontend Next.js Application
│       ├── app/             # Next.js 14 App Router
│       │   ├── components/  # Reusable React components
│       │   ├── jobs/        # Job-related pages
│       │   ├── admin/       # Admin panel pages
│       │   └── types/       # TypeScript type definitions
│       ├── tailwind.config.js
│       └── package.json
│
├── package.json             # Root workspace configuration
└── README.md
```

## 🛠️ Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Redis server
- AWS account (for DynamoDB, S3)
- Google Gemini API key (optional for CV analysis)

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd jobquest-platform

# Install all dependencies
npm run install:all
```

### Step 2: Environment Configuration

#### Backend Configuration

```bash
cd packages/api
cp .env.example .env
```

Edit `packages/api/.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# AWS Configuration (for production)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET_NAME=jobquest-cv-uploads

# DynamoDB Tables
JOBS_TABLE=Jobs
SARKARI_JOBS_TABLE=SarkariJobs
ADMINS_TABLE=Admins
SUBSCRIPTIONS_TABLE=Subscriptions

# Redis Configuration
REDIS_URL=redis://localhost:6379

# External APIs (optional)
GEMINI_API_KEY=your-gemini-api-key
MAILCHIMP_API_KEY=your-mailchimp-api-key
ONESIGNAL_APP_ID=your-onesignal-app-id

# Admin Credentials
ADMIN_EMAIL=admin@jobquest.com
ADMIN_PASSWORD=admin123
```

#### Frontend Configuration

```bash
cd packages/web
```

Create `packages/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
API_BASE_URL=http://localhost:5000/api/v1
```

### Step 3: Start Required Services

#### Start Redis (using Docker)

```bash
docker run -d -p 6379:6379 redis:alpine
```

#### Or install Redis locally:

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

### Step 4: Initialize Database (Development Mode)

For local development, the application will use mock data and in-memory storage. In production, you'll need to set up AWS DynamoDB tables as described in the documentation.

### Step 5: Start the Development Servers

#### Option 1: Start both servers concurrently

```bash
# From the root directory
npm run dev
```

#### Option 2: Start servers separately

**Terminal 1 - Backend:**
```bash
cd packages/api
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd packages/web
npm run dev
```

### Step 6: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

### Step 7: Admin Panel Access

1. Navigate to http://localhost:3000/admin/login
2. Use the demo credentials:
   - Email: `admin@jobquest.com`
   - Password: `admin123`

## 🔧 Development Workflow

### Adding New Jobs (Admin Panel)

1. Login to admin panel
2. Navigate to job management
3. Add single jobs or use bulk upload with Excel/CSV
4. Jobs are automatically cached and indexed

### Testing CV Analysis

1. Browse to any job listing
2. Click "Analyze CV" button
3. Upload a PDF/DOC resume
4. View AI-generated compatibility analysis

### API Testing

Use the following endpoints for testing:

```bash
# Get all jobs
curl http://localhost:5000/api/v1/jobs

# Get jobs with filters
curl "http://localhost:5000/api/v1/jobs?category=Software&location=Bangalore"

# Get single job
curl http://localhost:5000/api/v1/jobs/{jobId}

# Admin login
curl -X POST http://localhost:5000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jobquest.com","password":"admin123"}'
```

## 📊 Database Schema

### Jobs Table (DynamoDB)

- **Partition Key**: `category` (e.g., "Software", "HR")
- **Sort Key**: `jobId` (UUID)
- **Attributes**: role, companyName, location, salary, description, etc.

### SarkariJobs Table

- **Partition Key**: `organization` (e.g., "UPSC", "SSC")
- **Sort Key**: `jobId` (UUID)
- **Attributes**: postName, eligibility, importantDates, etc.

## 🚀 Production Deployment

### AWS Infrastructure Setup

1. **DynamoDB Tables**: Create tables as per schema
2. **S3 Bucket**: For CV file storage
3. **ElastiCache**: Redis cluster for caching
4. **ECS/EC2**: For API deployment
5. **CloudFront**: CDN for static assets

### Environment Variables

Update production environment variables with actual AWS credentials and service endpoints.

### Build and Deploy

```bash
# Build frontend
cd packages/web
npm run build

# Build and start API
cd packages/api
npm run build
npm start
```

## 🧪 Testing

### Run Tests

```bash
# API tests
cd packages/api
npm test

# Frontend tests
cd packages/web
npm test
```

### Manual Testing Checklist

- [ ] Job listing and filtering
- [ ] Job detail pages
- [ ] CV upload and analysis
- [ ] Admin login and job management
- [ ] Newsletter subscription
- [ ] Mobile responsiveness

## 📈 Performance Optimization

- **Caching**: Redis for API responses and frequent queries
- **CDN**: CloudFront for static assets
- **Database**: DynamoDB with proper indexing
- **Code Splitting**: Next.js automatic optimization
- **Image Optimization**: Next.js Image component

## 🔒 Security Features

- JWT authentication for admin panel
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Secure file upload with S3 pre-signed URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. Check the documentation in `/docs`
2. Review existing GitHub issues
3. Create a new issue with detailed description

## 🔄 Changelog

### v1.0.0
- Initial release with core features
- Job listing and filtering
- AI-powered CV analysis
- Admin panel with bulk upload
- Newsletter subscription system