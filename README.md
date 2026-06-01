# 🎓 Learning Platform - Learning-VN

> A Modern Full-Stack Learning Management System with AI-Powered Tutoring, Interactive Code Challenges, and Real-Time Progress Tracking

![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Active%20Development-success)
![Java](https://img.shields.io/badge/Java-25-orange)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.6-brightgreen?logo=springboot)

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Tech Stack](#%EF%B8%8F-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [📦 Backend Setup](#-backend-setup)
- [🎨 Frontend Setup](#-frontend-setup)
- [🐳 Docker Setup](#-docker-setup)
- [📚 API Documentation](#-api-documentation)
- [🔐 Authentication](#-authentication)
- [💳 Payment Integration](#-payment-integration)
- [🤖 AI Features](#-ai-features)
- [📊 Database Schema](#-database-schema)
- [🛠️ Development Workflow](#-development-workflow)
- [📝 Contributing](#-contributing)

---

## 🎯 Overview

**Learning-VN** is a comprehensive educational platform designed to help learners master programming and development skills through:

- 📚 **Structured Learning Paths**: Curated courses with chapters and lessons
- 🧩 **Code Challenges**: Real-world programming problems with instant feedback
- 📝 **Interactive Quizzes**: Test knowledge with comprehensive assessments
- 🤖 **AI Tutor**: Personalized learning guidance powered by AI
- 👥 **Interview Prep**: Mock interviews with detailed feedback
- 🏆 **Gamification**: XP system, leaderboards, and achievement tracking
- 💰 **Premium Content**: ZaloPay integration for subscription management

---

## ✨ Key Features

### 🎓 Learning Management
- **Courses & Roadmaps**: Browse and enroll in structured learning paths
- **Lessons**: Video-based lessons with progress tracking
- **Chapters**: Organize lessons into manageable sections
- **Completion Tracking**: Visual progress indicators for each course

### 💪 Interactive Learning
- **Code Challenges**: Write and test code with automated evaluation
- **Quizzes**: Multiple-choice assessments with instant feedback
- **Code Reviews**: Get AI-powered feedback on submitted code
- **Comments & Discussion**: Discuss lessons with community

### 🤖 AI-Powered Features
- **AI Tutor**: Generate personalized learning roadmaps
- **Code Analysis**: AI-powered code review and improvement suggestions
- **AI Tokens**: Token-based system for AI feature usage
- **Smart Feedback**: Contextual learning recommendations

### 👤 User Management
- **Authentication**: Secure JWT-based login/registration
- **OTP Verification**: Email-based account verification
- **User Profiles**: Customizable public and private profiles
- **Activity Dashboard**: Real-time statistics and heatmaps

### 💰 Subscription & Payments
- **Premium Subscriptions**: Unlock exclusive content
- **ZaloPay Integration**: Vietnam-based payment processing
- **Payment History**: Track all transactions
- **Free & Paid Content**: Mixed content model

### 🏅 Gamification
- **XP System**: Earn experience points for activities
- **Leaderboards**: Compete with other learners
- **Streaks**: Track daily learning consistency
- **Achievements**: Badges and milestones

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Library | 19.2.6 |
| **TypeScript** | Type Safety | ~6.0.2 |
| **Vite** | Build Tool | 8.0.12 |
| **TailwindCSS** | Styling | 4.3.0 |
| **React Router** | Navigation | 7.15.0 |
| **React Query** | State Management (Server) | 5.100.10 |
| **Zustand** | State Management (Client) | 5.0.13 |
| **Axios** | HTTP Client | 1.16.0 |
| **Recharts** | Data Visualization | 3.8.1 |
| **Lucide React** | Icons | 1.14.0 |

### Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Spring Boot** | Framework | 4.0.6 |
| **Java** | Language | 25 |
| **PostgreSQL** | Database | 16 |
| **Spring Security** | Authentication | Latest |
| **JWT** | Token Management | 0.11.5 |
| **Cloudinary** | Media Storage | 1.36.0 |
| **Spring Mail** | Email Service | Latest |
| **Spring Data JPA** | ORM | Latest |
| **Lombok** | Code Generation | - |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Orchestration |
| **Ollama** | Local AI Engine |
| **PostgreSQL** | Primary Database |

---

## 📁 Project Structure

```
Learning-Web/
├── Frontend/                          # React TypeScript Application
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── dashboard/           # Dashboard components
│   │   │   ├── roadmaps/            # Course roadmap components
│   │   │   └── ...
│   │   ├── pages/                    # Page components (route-based)
│   │   │   ├── Home.tsx             # Dashboard
│   │   │   ├── Login.tsx            # Authentication
│   │   │   ├── CourseDetail.tsx     # Course details
│   │   │   ├── LessonDetail.tsx     # Lesson content
│   │   │   ├── AiTutor.tsx          # AI tutor interface
│   │   │   ├── Interview.tsx        # Interview prep
│   │   │   └── ...
│   │   ├── store/                    # Zustand store (auth state)
│   │   ├── config/                   # Configuration files
│   │   │   └── axiosClient.ts       # HTTP client setup
│   │   ├── assets/                   # Static assets
│   │   ├── App.tsx                   # Main app component
│   │   └── main.tsx                  # Entry point
│   ├── public/                        # Static files
│   ├── package.json                   # Dependencies
│   ├── vite.config.ts                 # Vite configuration
│   ├── tailwind.config.ts             # Tailwind CSS configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   └── eslint.config.js               # ESLint configuration
│
├── Backend/                           # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/learningweb/learning_platform/
│   │   │   │   ├── config/           # Spring configuration
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── CloudinaryConfig.java
│   │   │   │   │   └── WebMvcConfig.java
│   │   │   │   ├── controller/       # REST endpoints
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── CourseController.java
│   │   │   │   │   ├── QuizController.java
│   │   │   │   │   ├── CodeChallengeController.java
│   │   │   │   │   ├── AiTutorController.java
│   │   │   │   │   ├── InterviewController.java
│   │   │   │   │   ├── PaymentController.java
│   │   │   │   │   └── ...
│   │   │   │   ├── service/          # Business logic
│   │   │   │   ├── repository/       # Data access
│   │   │   │   ├── entity/           # JPA entities
│   │   │   │   ├── dto/              # Data transfer objects
│   │   │   │   ├── security/         # JWT & auth logic
│   │   │   │   └── utils/            # Utility classes
│   │   │   ├── resources/
│   │   │   │   ├── application.properties
│   │   │   │   └── db/migration/     # Flyway migrations
│   │   │   └── templates/            # Email templates
│   │   └── test/                      # Unit tests
│   ├── pom.xml                        # Maven dependencies
│   ├── mvnw                           # Maven wrapper (Linux/Mac)
│   ├── mvnw.cmd                       # Maven wrapper (Windows)
│   └── HELP.md                        # Spring Boot help
│
├── docker-compose.yml                 # Docker services
├── sample-data.sql                    # Sample database data
└── README.md                          # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 16.x (Frontend)
- **Java** 25 (Backend)
- **Maven** 3.8.x (Backend)
- **PostgreSQL** 16 (Database)
- **Docker & Docker Compose** (Optional, for containerized setup)

### Quick Start (Docker)

The fastest way to get everything running:

```bash
# Navigate to project root
cd Learning-Web

# Start all services
docker-compose up -d

# Verify services
docker-compose ps
```

Services will be available at:
- 🖥️ **Frontend**: http://localhost:5173 (requires separate `npm run dev`)
- 🔗 **Backend API**: http://localhost:8080
- 🗄️ **PostgreSQL**: localhost:5433
- 🤖 **Ollama AI**: http://localhost:11434

---

## 📦 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd Backend
```

### Step 2: Configure Database

Update `src/main/resources/application.properties`:

```properties
# Server
server.port=8080
spring.application.name=learning-platform

# Database
spring.datasource.url=jdbc:postgresql://localhost:5433/learning_web_platform
spring.datasource.username=postgres
spring.datasource.password=123456
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# JWT
jwt.secret=your_super_secret_jwt_key_here_min_256_bits
jwt.expiration=86400000

# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password

# Cloudinary
cloudinary.cloud_name=your_cloud_name
cloudinary.api_key=your_api_key
cloudinary.api_secret=your_api_secret
```

### Step 3: Build the Project

```bash
# Using Maven wrapper (Windows)
mvnw.cmd clean install

# Using Maven wrapper (Linux/Mac)
./mvnw clean install

# Or with system Maven
mvn clean install
```

### Step 4: Run the Application

```bash
# Using Maven
mvn spring-boot:run

# Or run the JAR directly
java -jar target/learning-platform-0.0.1-SNAPSHOT.jar
```

✅ Backend will start at `http://localhost:8080`

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd Frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

Create `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Learning-VN
VITE_TIMEOUT=30000
```

### Step 4: Run Development Server

```bash
npm run dev
```

✅ Frontend will start at `http://localhost:5173`

### Step 5: Build for Production

```bash
npm run build
npm run preview
```

### Linting & Code Quality

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix
```

---

## 🐳 Docker Setup

### Option 1: Quick Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Option 2: Build & Run Individual Services

```bash
# Build Backend image
docker build -f Backend/Dockerfile -t learning-backend .

# Run Backend container
docker run -p 8080:8080 learning-backend

# Build Frontend image
docker build -f Frontend/Dockerfile -t learning-frontend .

# Run Frontend container
docker run -p 5173:5173 learning-frontend
```

### Services in docker-compose.yml

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `db` | postgres:16 | 5433 | PostgreSQL database |
| `ai-engine` | ollama/ollama | 11434 | Local AI/ML engine |

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "aiTokens": 10,
    "totalXp": 1250
  }
}
```

### Courses & Learning

#### Get All Courses
```http
GET /api/courses
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "title": "Python Fundamentals",
    "description": "Learn Python basics...",
    "level": "BEGINNER",
    "totalLessons": 25,
    "totalDuration": 12,
    "averageRating": 4.8,
    "completionPercentage": 45
  }
]
```

#### Get Course Details
```http
GET /api/courses/{courseId}
Authorization: Bearer {token}

Response:
{
  "id": 1,
  "title": "Python Fundamentals",
  "description": "...",
  "sections": [
    {
      "id": 1,
      "title": "Chapter 1: Basics",
      "lessons": [
        {
          "id": 1,
          "title": "Introduction",
          "videoUrl": "https://...",
          "duration": 15,
          "status": "completed"
        }
      ]
    }
  ]
}
```

### Quizzes

#### Submit Quiz Answer
```http
POST /api/quizzes/{quizId}/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": {
    "question_1": "option_a",
    "question_2": "option_c"
  }
}

Response:
{
  "score": 85,
  "isPassed": true,
  "earnedXp": 100
}
```

### Code Challenges

#### Submit Code Solution
```http
POST /api/challenges/{challengeId}/process
Authorization: Bearer {token}
Content-Type: application/json

{
  "language": "python",
  "submittedCode": "def solution():\n    pass",
  "isAiAnalysis": false
}

Response (Evaluation):
{
  "type": "EVALUATION",
  "status": "ACCEPTED",
  "xpEarned": 150,
  "message": "All test cases passed!"
}
```

#### Get AI Code Review
```http
POST /api/challenges/{challengeId}/process
Authorization: Bearer {token}
Content-Type: application/json

{
  "language": "python",
  "submittedCode": "def solution():\n    pass",
  "isAiAnalysis": true
}

Response (AI Analysis):
{
  "type": "AI_ANALYSIS",
  "feedback": "## Code Review\n\n**Strengths:**\n- ...",
  "remainingTokens": 9
}
```

### AI Tutor

#### Generate Learning Roadmap
```http
POST /api/ai-tutor/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "targetLanguage": "JavaScript",
  "currentSkillLevel": "BEGINNER",
  "learningStyle": "VISUAL",
  "availableHoursPerWeek": 10
}

Response:
{
  "roadmap": "# Your Personalized Learning Path\n\n## Week 1: ...",
  "remainingTokens": 9
}
```

### Payment

#### Create Payment Order
```http
POST /api/payment/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 99000,
  "orderInfo": "Premium Subscription - 1 Month"
}

Response:
{
  "payUrl": "https://zalopay.vn/pay?...",
  "appTransId": "240601_...",
  "orderId": 12345
}
```

---

## 🔐 Authentication

### JWT Token Flow

```
1. User Login (email + password)
   ↓
2. Backend validates credentials
   ↓
3. Backend generates JWT token (valid for 24 hours)
   ↓
4. Frontend stores token in localStorage
   ↓
5. Frontend includes token in Authorization header for all requests
   ↓
6. Backend validates token before processing request
   ↓
7. On token expiration, user must login again
```

### Token Storage

**Frontend** (`src/store/authStore.ts`):
- Tokens stored in **localStorage**
- Automatic token refresh (if implemented)
- Logout clears stored token

**Axios Interceptor** (`src/config/axiosClient.ts`):
```typescript
// Automatically adds token to all requests
Authorization: Bearer {token}
```

### Security Features

✅ JWT tokens with expiration  
✅ Password hashing (Spring Security)  
✅ CORS protection  
✅ CSRF tokens  
✅ Input validation & sanitization  

---

## 💳 Payment Integration

### ZaloPay Integration

#### Payment Flow

```
User clicks "Buy Premium"
      ↓
Frontend calls POST /api/payment/create
      ↓
Backend generates ZaloPay payment link
      ↓
Frontend redirects to ZaloPay
      ↓
User scans QR code / enters card info
      ↓
Payment success/failure callback
      ↓
Backend updates user subscription status
      ↓
Frontend shows confirmation
```

#### Payment Statuses

| Status | Meaning |
|--------|---------|
| `PENDING` | Awaiting payment |
| `COMPLETED` | Payment successful |
| `FAILED` | Payment failed |
| `CANCELLED` | User cancelled |

---

## 🤖 AI Features

### AI Tutor System

**Features:**
- 📚 Generate personalized learning roadmaps
- 💡 Recommend courses based on skill level
- 🎯 Suggest optimal learning paths
- ⏱️ Adaptive scheduling

**Token System:**
- Each user gets **10 AI tokens** initially
- Each AI feature usage costs **1 token**
- Tokens can be purchased via ZaloPay
- Tokens expire after 30 days (configurable)

### AI Code Review

**Features:**
- 🔍 Analyze submitted code
- 💬 Provide improvement suggestions
- 🐛 Identify potential bugs
- 📝 Suggest best practices
- ⭐ Explain code logic

**Supported Languages:**
- Python
- JavaScript / TypeScript
- Java
- C++
- SQL
- And more...

### Integration with Ollama

```bash
# Ollama setup
docker run -d -p 11434:11434 --name ollama ollama/ollama

# Pull a model
docker exec ollama ollama pull neural-chat

# Backend connects to: http://localhost:11434/api
```

---

## 📊 Database Schema

### Core Tables

```
Users
├── id (PK)
├── email (UNIQUE)
├── password (hashed)
├── name
├── avatar_url
├── role (USER/ADMIN)
├── ai_tokens
├── total_xp
├── status (ACTIVE/INACTIVE)
└── created_at, updated_at

Courses
├── id (PK)
├── title
├── description
├── level (BEGINNER/INTERMEDIATE/ADVANCED)
├── icon_url
├── thumbnail_url
├── total_lessons
├── total_duration
├── average_rating
└── created_at, updated_at

Lessons
├── id (PK)
├── course_id (FK)
├── chapter_id (FK)
├── title
├── description
├── video_url
├── duration
├── order_index
├── is_free
└── created_at, updated_at

UserCourseProgress
├── id (PK)
├── user_id (FK)
├── course_id (FK)
├── completion_percentage
├── status (NOT_STARTED/IN_PROGRESS/COMPLETED)
└── completed_at

Quizzes
├── id (PK)
├── lesson_id (FK)
├── title
├── questions (JSON)
└── passing_score

UserQuizResults
├── id (PK)
├── user_id (FK)
├── quiz_id (FK)
├── score
├── is_passed
├── answers (JSON)
└── taken_at

CodeChallenges
├── id (PK)
├── course_id (FK)
├── title
├── description
├── starter_code
├── test_cases (JSON)
├── difficulty (EASY/MEDIUM/HARD)

UserChallengeSubmissions
├── id (PK)
├── user_id (FK)
├── challenge_id (FK)
├── submitted_code
├── status (ACCEPTED/WRONG_ANSWER/RUNTIME_ERROR)
├── xp_earned
└── submitted_at

Payments
├── id (PK)
├── user_id (FK)
├── amount
├── status (PENDING/COMPLETED/FAILED)
├── payment_method (ZALOPAY)
├── app_trans_id
└── transaction_date

Subscriptions
├── id (PK)
├── user_id (FK)
├── plan_type (FREE/PREMIUM/PRO)
├── start_date
├── end_date
├── is_active
└── auto_renewal
```

---

## 🛠️ Development Workflow

### Branch Strategy

```
main (production)
  ↓
develop (staging)
  ↓
feature/feature-name (development)
```

### Commit Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
refactor: Code refactoring
perf: Performance improvement
test: Add/update tests
chore: Build/config changes
```

### Example

```bash
# Create feature branch
git checkout -b feature/ai-tutor-improvements

# Make changes and commit
git add .
git commit -m "feat: Improve AI tutor response accuracy"

# Push and create PR
git push origin feature/ai-tutor-improvements
```

### Running Tests

**Backend:**
```bash
mvn test
```

**Frontend:**
```bash
npm test
```

### Code Quality Checks

**Backend (Maven):**
```bash
mvn spotbugs:check
mvn pmd:check
```

**Frontend (ESLint):**
```bash
npm run lint
npm run lint -- --fix
```

---

## 📝 Contributing

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style Guide

**Backend (Java):**
- Use **Google Java Style Guide**
- Run `mvn formatter:format` before committing
- Add JavaDoc for public methods

**Frontend (TypeScript/React):**
- Use **Prettier** for formatting
- Follow **React Best Practices**
- Add TypeScript types for all functions
- Run `npm run lint -- --fix` before committing

### Review Checklist

- ✅ Code follows style guidelines
- ✅ Tests added/updated
- ✅ Documentation updated
- ✅ No breaking changes
- ✅ Performance impact considered

---

## 🐛 Troubleshooting

### Frontend Issues

**Issue: Port 5173 already in use**
```bash
# Find and kill process
netstat -ano | findstr :5173  # Windows
lsof -i :5173                # Mac/Linux
kill -9 <PID>               # Kill process
```

**Issue: API connection errors**
- Check backend is running on port 8080
- Verify `.env.local` has correct API URL
- Check CORS settings in backend

### Backend Issues

**Issue: Database connection failed**
```bash
# Check PostgreSQL running
docker-compose ps

# Verify connection string in application.properties
# Default: jdbc:postgresql://localhost:5433/learning_web_platform
```

**Issue: Java version mismatch**
```bash
# Check Java version
java -version

# Should be Java 25 or higher
```

### Docker Issues

**Issue: Containers won't start**
```bash
# View detailed logs
docker-compose logs -f service_name

# Rebuild containers
docker-compose down -v
docker-compose up --build
```

---

## 📞 Support & Contact

- 📧 **Email**: support@learning-vn.com
- 💬 **Discord**: [Join Community](https://discord.gg/learning-vn)
- 🐦 **Twitter**: [@LearningVN](https://twitter.com/LearningVN)
- 📖 **Wiki**: [Project Wiki](https://github.com/learning-vn/wiki)

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Thanks to all contributors
- Special thanks to Spring Boot and React communities
- Icons from Lucide React
- Design inspiration from modern edtech platforms

---

## 📈 Roadmap

- [ ] Mobile app (React Native)
- [ ] Video streaming optimization
- [ ] Advanced analytics dashboard
- [ ] Gamification enhancements
- [ ] Multi-language support
- [ ] Machine learning recommendations
- [ ] Real-time collaboration features
- [ ] Blockchain certificates

---

<div align="center">

**⭐ If you find this project helpful, please star it! ⭐**

Made with ❤️ by the Learning-VN Team

[Back to Top ↑](#-learning-platform---learning-vn)

</div>
