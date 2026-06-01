# 🔧 Learning Platform Backend - Spring Boot

> A robust RESTful API built with Spring Boot 4.0.6 & Java 25 for the Learning-VN educational platform

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.6-brightgreen?logo=springboot)
![Java](https://img.shields.io/badge/Java-25-orange?logo=java)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Maven](https://img.shields.io/badge/Maven-3.8%2B-C71C22?logo=apachemaven)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Database Architecture](#-database-architecture)
- [Controllers & Services](#-controllers--services)
- [Security & Authentication](#-security--authentication)
- [Error Handling](#-error-handling)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Overview

The Learning Platform Backend is a comprehensive REST API that powers the learning management system. It handles:

- 🔐 **User Authentication & Authorization** - JWT-based secure access
- 📚 **Course Management** - Complete course, lesson, and chapter management
- 📝 **Assessments** - Quizzes and code challenges with instant evaluation
- 🤖 **AI Integration** - AI tutor and code review services
- 💳 **Payment Processing** - ZaloPay integration for subscriptions
- 👥 **Community Features** - Comments, reviews, and user interactions
- 📊 **Analytics** - User progress tracking and activity heatmaps
- 🎤 **Interview Preparation** - Mock interviews with feedback

---

## 🛠️ Tech Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Java | 25 | Latest Java features |
| **Framework** | Spring Boot | 4.0.6 | REST API framework |
| **Build Tool** | Maven | 3.8+ | Dependency management |
| **Database** | PostgreSQL | 16 | Primary data store |
| **ORM** | Spring Data JPA | Latest | Database abstraction |
| **Security** | Spring Security | Latest | Authentication & authorization |
| **Authentication** | JWT (JJWT) | 0.11.5 | Token-based auth |
| **Email** | Spring Mail | Latest | Email notifications |
| **File Storage** | Cloudinary | 1.36.0 | Cloud media storage |
| **Validation** | Spring Validation | Latest | Input validation |
| **Testing** | JUnit 5 | Latest | Unit & integration tests |
| **Code Generation** | Lombok | Latest | Reduce boilerplate |

---

## 📁 Project Structure

```
Backend/
├── src/
│   ├── main/
│   │   ├── java/com/learningweb/learning_platform/
│   │   │   ├── LearningPlatformApplication.java      # Spring Boot entry point
│   │   │   │
│   │   │   ├── config/                               # Spring configuration
│   │   │   │   ├── SecurityConfig.java               # JWT & Spring Security setup
│   │   │   │   ├── CloudinaryConfig.java             # Image upload configuration
│   │   │   │   └── WebMvcConfig.java                 # CORS & web configuration
│   │   │   │
│   │   │   ├── controller/                           # REST Controllers (19 controllers)
│   │   │   │   ├── AuthController.java               # Login, Register, OTP verification
│   │   │   │   ├── UserController.java               # User profile management
│   │   │   │   ├── CourseController.java             # Course CRUD & retrieval
│   │   │   │   ├── LessonController.java             # Lesson management
│   │   │   │   ├── QuizController.java               # Quiz submission & results
│   │   │   │   ├── CodeChallengeController.java      # Code challenge submission
│   │   │   │   ├── CodeReviewController.java         # Code review requests
│   │   │   │   ├── AiTutorController.java            # AI roadmap generation
│   │   │   │   ├── InterviewController.java          # Interview management
│   │   │   │   ├── PaymentController.java            # ZaloPay integration
│   │   │   │   ├── DashboardController.java          # User statistics & heatmaps
│   │   │   │   ├── EnrollmentController.java         # Course enrollment
│   │   │   │   ├── BookmarkController.java           # Bookmark management
│   │   │   │   ├── CourseReviewController.java       # Course ratings & reviews
│   │   │   │   ├── LessonCommentController.java      # Lesson discussions
│   │   │   │   ├── StudySessionController.java       # Study sessions
│   │   │   │   ├── FileUploadController.java         # File/image uploads
│   │   │   │   ├── MusicController.java              # Background music management
│   │   │   │   └── CourseContentController.java      # Course content management
│   │   │   │
│   │   │   ├── entity/                               # JPA Entities (30+ entities)
│   │   │   │   ├── User.java                         # User accounts
│   │   │   │   ├── Course.java                       # Courses
│   │   │   │   ├── Section.java                      # Course chapters/sections
│   │   │   │   ├── Lesson.java                       # Individual lessons
│   │   │   │   ├── Quiz.java                         # Quiz content
│   │   │   │   ├── QuizQuestion.java                 # Quiz questions
│   │   │   │   ├── QuizOption.java                   # Multiple choice options
│   │   │   │   ├── QuizAttempt.java                  # User quiz attempts
│   │   │   │   ├── CodeChallenge.java                # Code challenges
│   │   │   │   ├── CodeSubmission.java               # Code submissions
│   │   │   │   ├── TestCase.java                     # Test cases for validation
│   │   │   │   ├── Enrollment.java                   # Course enrollments
│   │   │   │   ├── LessonProgress.java               # User lesson progress
│   │   │   │   ├── LessonComment.java                # Lesson discussions
│   │   │   │   ├── Interview.java                    # Interview templates
│   │   │   │   ├── InterviewSession.java             # Interview attempts
│   │   │   │   ├── InterviewQuestion.java            # Interview questions
│   │   │   │   ├── InterviewAnswer.java              # User answers
│   │   │   │   ├── PaymentTransaction.java           # Payment records
│   │   │   │   ├── PricingPackage.java               # Subscription plans
│   │   │   │   ├── AiLearning.java                   # AI tutor roadmaps
│   │   │   │   ├── CourseReview.java                 # Course ratings
│   │   │   │   ├── Category.java                     # Course categories
│   │   │   │   ├── Bookmark.java                     # User bookmarks
│   │   │   │   ├── StudySession.java                 # Study tracking
│   │   │   │   ├── StudyNote.java                    # User notes
│   │   │   │   ├── StudyTodoItem.java                # Study todos
│   │   │   │   ├── PersonalGoal.java                 # User goals
│   │   │   │   ├── UserSkill.java                    # User skill progression
│   │   │   │   ├── LessonMaterial.java               # Lesson resources
│   │   │   │   └── MusicTrack.java                   # Background music
│   │   │   │
│   │   │   ├── dto/                                  # Data Transfer Objects
│   │   │   │   ├── AuthRequest.java                  # Login credentials
│   │   │   │   ├── AuthResponse.java                 # Login response
│   │   │   │   ├── CourseListResponse.java           # Course listing
│   │   │   │   ├── CourseDetailResponse.java         # Course details
│   │   │   │   ├── CodeSubmitRequest.java            # Code submission
│   │   │   │   ├── CodeReviewRequest.java            # Code review request
│   │   │   │   ├── CodeReviewResponse.java           # AI feedback
│   │   │   │   ├── AnswerRequest.java                # Quiz answer
│   │   │   │   ├── CommentRequest.java               # Comment creation
│   │   │   │   ├── ActivityHeatmapResponse.java      # Dashboard heatmap
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── repository/                           # Spring Data JPA repositories
│   │   │   │   ├── UserRepository.java               # User queries
│   │   │   │   ├── CourseRepository.java             # Course queries
│   │   │   │   ├── QuizRepository.java               # Quiz queries
│   │   │   │   ├── CodeChallengeRepository.java      # Challenge queries
│   │   │   │   ├── EnrollmentRepository.java         # Enrollment queries
│   │   │   │   ├── LessonProgressRepository.java     # Progress queries
│   │   │   │   ├── PaymentTransactionRepository.java # Payment queries
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── service/                              # Business logic layer
│   │   │   │   ├── UserService.java                  # User operations
│   │   │   │   ├── AuthService.java                  # Authentication
│   │   │   │   ├── CourseService.java                # Course operations
│   │   │   │   ├── LessonService.java                # Lesson operations
│   │   │   │   ├── QuizService.java                  # Quiz evaluation
│   │   │   │   ├── CodeChallengeService.java         # Code validation
│   │   │   │   ├── AiTutorService.java               # AI integration
│   │   │   │   ├── PaymentService.java               # ZaloPay integration
│   │   │   │   ├── EmailService.java                 # Email notifications
│   │   │   │   ├── DashboardService.java             # Statistics & analytics
│   │   │   │   ├── InterviewService.java             # Interview logic
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── security/                             # Security components
│   │   │   │   ├── JwtFilter.java                    # JWT validation filter
│   │   │   │   ├── JwtProvider.java                  # JWT token generation
│   │   │   │   └── CustomUserDetailsService.java     # User authentication
│   │   │   │
│   │   │   └── utils/                                # Utility classes
│   │   │       ├── EmailUtil.java                    # Email helpers
│   │   │       ├── EncryptionUtil.java               # Data encryption
│   │   │       ├── CloudinaryUtil.java               # Image handling
│   │   │       └── ...
│   │   │
│   │   └── resources/
│   │       ├── application.properties                # Main configuration
│   │       ├── application-dev.properties            # Development config
│   │       ├── application-prod.properties           # Production config
│   │       ├── db/migration/                         # Database migrations
│   │       ├── templates/                            # Email templates
│   │       │   ├── email/welcome.html
│   │       │   ├── email/otp.html
│   │       │   └── email/payment-receipt.html
│   │       └── static/music/                         # Background music files
│   │
│   └── test/
│       └── java/com/learningweb/learning_platform/
│           └── LearningPlatformApplicationTests.java # Integration tests
│
├── pom.xml                                           # Maven configuration
├── mvnw                                              # Maven wrapper (Linux/Mac)
├── mvnw.cmd                                          # Maven wrapper (Windows)
├── HELP.md                                           # Spring Boot help
└── README.md                                         # This file
```

---

## 📋 Prerequisites

Before setting up the backend, ensure you have:

- **Java 25** or higher
  ```bash
  java -version
  # Should output: openjdk version "25"
  ```

- **Maven 3.8.x** or higher
  ```bash
  mvn -version
  # Should output Maven version 3.8.x or higher
  ```

- **PostgreSQL 16**
  ```bash
  psql --version
  # Should output: psql (PostgreSQL) 16.x
  ```

- **Git** (for version control)

---

## 🚀 Installation & Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/your-org/learning-web.git
cd Learning-Web/Backend
```

### Step 2: Install Dependencies

```bash
# Windows
mvnw.cmd clean install

# Linux/Mac
./mvnw clean install
```

This will:
- Download all Maven dependencies
- Build the project
- Run tests

### Step 3: Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE learning_web_platform;
CREATE USER learning_user WITH PASSWORD 'learning_password';
ALTER ROLE learning_user SET client_encoding TO 'utf8';
ALTER ROLE learning_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE learning_user SET default_transaction_deferrable TO on;
ALTER ROLE learning_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE learning_web_platform TO learning_user;

# Exit
\q
```

### Step 4: Configure Application Properties

Edit `src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/
spring.application.name=learning-platform

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432
spring.datasource.username=postgres
spring.datasource.password=
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=your_very_long_secret_key_minimum_256_bits_required_here
jwt.expiration=86400000  # 24 hours in milliseconds

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# Cloudinary Configuration (Image Upload)
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret

# ZaloPay Configuration (Payment)
zalopay.endpoint.create=https://sb-openapi.zalopay.vn/v2/create
zalopay.app-id=2553
zalopay.key1=your_zalopay_key1
zalopay.key2=your_zalopay_key2

# Logging
logging.level.root=INFO
logging.level.com.learningweb=DEBUG
logging.level.org.springframework.security=DEBUG

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

---

## ⚙️ Configuration

### Environment-Specific Profiles

Create separate property files for different environments:

**`application-dev.properties`** (Development)
```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
logging.level.root=DEBUG
```

**`application-prod.properties`** (Production)
```properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
logging.level.root=INFO
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.jks
server.ssl.key-store-password=your_password
```

Run with profile:
```bash
# Development
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Production
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

### Logging Configuration

Edit `src/main/resources/logback-spring.xml`:

```xml
<configuration>
  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>
        %d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
      </pattern>
    </encoder>
  </appender>

  <root level="INFO">
    <appender-ref ref="CONSOLE" />
  </root>

  <logger name="com.learningweb" level="DEBUG"/>
  <logger name="org.springframework.security" level="DEBUG"/>
</configuration>
```

---

## 🏃 Running the Application

### Option 1: Maven (Development)

```bash
mvn spring-boot:run
```

### Option 2: JAR File

```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/learning-platform-0.0.1-SNAPSHOT.jar
```

### Option 3: IDE (IntelliJ IDEA)

1. Open project in IntelliJ
2. Right-click `LearningPlatformApplication.java`
3. Select "Run 'LearningPlatformApplication'"
4. Or press `Shift+F10`

### Option 4: Docker

```bash
# Build Docker image
docker build -t learning-backend .

# Run container
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/learning_web_platform \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=123456 \
  learning-backend
```

### Verify Application Started

```bash
# Should return 200 OK
curl http://localhost:8080/api/auth/health

# Check logs
tail -f logs/application.log
```

---

## 📚 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `POST` | `/login` | User login | ❌ |
| `POST` | `/register` | User registration | ❌ |
| `POST` | `/verify-otp` | Verify OTP email | ❌ |
| `POST` | `/refresh-token` | Refresh JWT token | ✅ |
| `POST` | `/logout` | User logout | ✅ |

### Users (`/api/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/profile` | Get user profile | ✅ |
| `PUT` | `/profile` | Update profile | ✅ |
| `PUT` | `/password` | Change password | ✅ |
| `GET` | `/public/{userId}` | Get public profile | ❌ |
| `GET` | `/skills` | Get user skills | ✅ |

### Courses (`/api/courses`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | List all courses | ✅ |
| `GET` | `/{courseId}` | Get course details | ✅ |
| `GET` | `/{courseId}/reviews` | Get course reviews | ✅ |
| `POST` | `/{courseId}/reviews` | Create review | ✅ |
| `POST` | `/search` | Search courses | ✅ |

### Lessons (`/api/lessons`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/{lessonId}` | Get lesson details | ✅ |
| `PUT` | `/{lessonId}/progress` | Update progress | ✅ |
| `GET` | `/{lessonId}/comments` | Get comments | ✅ |
| `POST` | `/{lessonId}/comments` | Post comment | ✅ |

### Quizzes (`/api/quizzes`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/{quizId}` | Get quiz | ✅ |
| `POST` | `/{quizId}/submit` | Submit answers | ✅ |
| `GET` | `/{quizId}/results` | Get quiz results | ✅ |

### Code Challenges (`/api/challenges`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/{challengeId}` | Get challenge | ✅ |
| `POST` | `/{challengeId}/process` | Submit code | ✅ |
| `GET` | `/{challengeId}/submissions` | Get submissions | ✅ |

### AI Tutor (`/api/ai-tutor`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/generate` | Generate roadmap | ✅ |
| `POST` | `/code-review` | AI code review | ✅ |

### Payments (`/api/payment`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/create` | Create order | ✅ |
| `GET` | `/history` | Payment history | ✅ |
| `POST` | `/callback` | ZaloPay callback | ❌ |

### Dashboard (`/api/dashboard`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/stats` | User statistics | ✅ |
| `GET` | `/heatmap` | Activity heatmap | ✅ |
| `GET` | `/leaderboard` | Global leaderboard | ✅ |

---

## 💾 Database Architecture

### Entity Relationship Diagram

```
Users
├─→ Enrollments ──→ Courses
├─→ QuizAttempts ──→ Quizzes
├─→ CodeSubmissions ──→ CodeChallenges
├─→ InterviewSessions ──→ Interviews
├─→ PaymentTransactions
├─→ StudySessions
├─→ PersonalGoals
├─→ LessonComments ──→ Lessons
├─→ CourseReviews ──→ Courses
├─→ UserSkills
└─→ Bookmarks ──→ Lessons

Courses
├─→ Sections
│   └─→ Lessons
│       ├─→ Quizzes
│       ├─→ CodeChallenges
│       ├─→ LessonComments
│       └─→ LessonMaterials
├─→ CourseReviews
└─→ Enrollments

Interviews
├─→ InterviewQuestions
│   └─→ InterviewOptions
└─→ InterviewSessions
    └─→ InterviewAnswers
```

### Key Tables

```sql
-- Users Table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url VARCHAR(500),
  bio TEXT,
  role ENUM('ADMIN', 'USER', 'INSTRUCTOR'),
  ai_tokens INT DEFAULT 10,
  total_xp INT DEFAULT 0,
  status ENUM('ACTIVE', 'INACTIVE', 'BANNED'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE courses (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
  duration_hours INT,
  average_rating DECIMAL(3,2),
  total_lessons INT,
  icon_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments Table
CREATE TABLE enrollments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  course_id BIGINT REFERENCES courses(id),
  progress_percentage INT DEFAULT 0,
  status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- Quizzes Table
CREATE TABLE quizzes (
  id BIGSERIAL PRIMARY KEY,
  lesson_id BIGINT REFERENCES lessons(id),
  title VARCHAR(255),
  total_questions INT,
  passing_score INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PaymentTransactions Table
CREATE TABLE payment_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  amount DECIMAL(10,2),
  status ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'),
  payment_method VARCHAR(50),
  app_trans_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎮 Controllers & Services

### Controller Layer

Controllers handle HTTP requests and delegate to services:

```java
@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseListResponse>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<CourseDetailResponse> getCourseDetail(@PathVariable Long courseId) {
        return ResponseEntity.ok(courseService.getCourseDetail(courseId));
    }

    @PostMapping("/{courseId}/reviews")
    public ResponseEntity<CourseReviewResponse> createReview(
        @PathVariable Long courseId,
        @RequestBody CourseReviewRequest request,
        @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(courseService.createReview(courseId, request, userDetails.getUsername()));
    }
}
```

### Service Layer

Services contain business logic:

```java
@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseMapper courseMapper;

    public List<CourseListResponse> getAllCourses() {
        return courseRepository.findAll()
            .stream()
            .map(courseMapper::toCourseListResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public CourseDetailResponse getCourseDetail(Long courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        return courseMapper.toCourseDetailResponse(course);
    }

    @Transactional
    public CourseReviewResponse createReview(Long courseId, CourseReviewRequest request, String username) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CourseReview review = CourseReview.builder()
            .course(course)
            .user(user)
            .rating(request.getRating())
            .comment(request.getComment())
            .build();

        return courseMapper.toCourseReviewResponse(courseRepository.save(review));
    }
}
```

### Repository Layer

Repositories handle database access:

```java
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByLevel(CourseLevel level);
    
    List<Course> findByTitleContainingIgnoreCase(String title);
    
    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.sections WHERE c.id = :id")
    Optional<Course> findByIdWithSections(@Param("id") Long id);
    
    Page<Course> findAll(Pageable pageable);
}
```

---

## 🔐 Security & Authentication

### JWT Token Flow

```
1. User sends credentials to /api/auth/login
   ↓
2. AuthService validates username/password
   ↓
3. JwtProvider generates JWT token
   ↓
4. Token returned to client
   ↓
5. Client includes token in Authorization header
   ↓
6. JwtFilter validates token on each request
   ↓
7. Request processed with authenticated user
```

### JWT Token Structure

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "sub": "user_email",
  "roles": ["USER"],
  "iat": 1234567890,
  "exp": 1234567890
}

Signature: HMACSHA256(header + payload, secret)
```

### JWT Filter

```java
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromRequest(request);
        
        if (token != null && jwtProvider.validateToken(token)) {
            String email = jwtProvider.getEmailFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

### Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courses").authenticated()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://yourfrontend.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

---

## ❌ Error Handling

### Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.NOT_FOUND.value())
            .error("Not Found")
            .message(ex.getMessage())
            .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Validation Error")
            .message(ex.getMessage())
            .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("An unexpected error occurred")
            .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| `200` | OK | Successful request |
| `201` | Created | Resource created |
| `400` | Bad Request | Invalid input data |
| `401` | Unauthorized | Missing/invalid token |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate entry |
| `500` | Server Error | Internal error |

---

## 🧪 Testing

### Unit Tests

```bash
mvn test
```

### Integration Tests

```bash
mvn verify
```

### Example Test

```java
@SpringBootTest
@AutoConfigureMockMvc
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CourseRepository courseRepository;

    @Test
    void testGetAllCourses() throws Exception {
        // Create test data
        Course course = Course.builder()
            .title("Test Course")
            .description("Test description")
            .level(CourseLevel.BEGINNER)
            .build();
        courseRepository.save(course);

        // Perform request
        mockMvc.perform(get("/api/courses")
            .header("Authorization", "Bearer " + getTestToken()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("Test Course"));
    }

    @Test
    void testGetCourseDetail() throws Exception {
        Course course = courseRepository.save(createTestCourse());

        mockMvc.perform(get("/api/courses/" + course.getId())
            .header("Authorization", "Bearer " + getTestToken()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(course.getId()));
    }
}
```

---

## 🚢 Deployment

### Production Build

```bash
# Build JAR with production profile
mvn clean package -Dspring.profiles.active=prod

# JAR location: target/learning-platform-0.0.1-SNAPSHOT.jar
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM openjdk:25-jdk-slim

WORKDIR /app

COPY target/learning-platform-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Environment Variables

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/learning_web_platform
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=secure_password
export JWT_SECRET=your_secret_key_here
export CLOUDINARY_CLOUD_NAME=your_cloud_name
export ZALOPAY_APP_ID=2553
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: learning-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: learning-backend
  template:
    metadata:
      labels:
        app: learning-backend
    spec:
      containers:
      - name: backend
        image: learning-backend:1.0
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_DATASOURCE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        - name: SPRING_DATASOURCE_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: username
```

---

## 🐛 Troubleshooting

### Port 8080 Already in Use

```bash
# Find process using port 8080
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Database Connection Error

```bash
# Check PostgreSQL is running
docker-compose ps

# Verify connection string
# Should be: jdbc:postgresql://localhost:5433/learning_web_platform

# Test connection
psql -h localhost -p 5433 -U postgres -d learning_web_platform
```

### JWT Token Issues

```
Error: "Invalid token"
Solution: 
- Check token hasn't expired (24 hours default)
- Verify token includes "Bearer " prefix
- Ensure JWT_SECRET is consistent

Error: "Token not found"
Solution:
- Add Authorization header with "Bearer {token}"
- Check header name is exactly "Authorization"
```

### Memory Issues

```bash
# Increase JVM memory
java -Xmx1024m -Xms512m -jar target/learning-platform-0.0.1-SNAPSHOT.jar
```

### Slow API Responses

1. Check database indexes:
   ```sql
   CREATE INDEX idx_user_email ON users(email);
   CREATE INDEX idx_course_level ON courses(level);
   CREATE INDEX idx_enrollment_user ON enrollments(user_id);
   ```

2. Enable query logging:
   ```properties
   spring.jpa.properties.hibernate.generate_statistics=true
   ```

3. Check database connection pool:
   ```properties
   spring.datasource.hikari.maximum-pool-size=20
   ```

---

## 📝 Contributing

### Development Workflow

1. Create feature branch
   ```bash
   git checkout -b feature/new-feature
   ```

2. Make changes and commit
   ```bash
   git add .
   git commit -m "feat: Add new feature"
   ```

3. Push and create PR
   ```bash
   git push origin feature/new-feature
   ```

### Code Style

- Follow **Google Java Style Guide**
- Run formatter:
  ```bash
  mvn formatter:format
  ```

- Run linter:
  ```bash
  mvn pmd:check
  mvn spotbugs:check
  ```

---

## 📞 Support

- 📧 **Email**: backend@learning-vn.com
- 💬 **Discord**: [Join Server](https://discord.gg/learning-vn)
- 📖 **Documentation**: [API Docs](https://api.learning-vn.com/docs)
- 🐛 **Report Bug**: [GitHub Issues](https://github.com/learning-vn/backend/issues)

---

## 📄 License

MIT License - see LICENSE file for details

---

<div align="center">

**Built with ❤️ using Spring Boot & Java**

[Back to Top ↑](#-learning-platform-backend---spring-boot)

</div>
