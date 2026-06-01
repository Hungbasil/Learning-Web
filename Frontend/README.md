# 🎨 Learning Platform Frontend - React TypeScript

> A modern, responsive web application built with React 19, TypeScript, and TailwindCSS for the Learning-VN platform

![React](https://img.shields.io/badge/React-19.2.6-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.0-646cff?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Development](#-development)
- [Build & Deployment](#-build--deployment)
- [Component Architecture](#-component-architecture)
- [State Management](#-state-management)
- [API Integration](#-api-integration)
- [Styling Guide](#-styling-guide)
- [Performance Optimization](#-performance-optimization)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Overview

**Learning Platform Frontend** is a comprehensive React web application designed to provide an engaging learning experience with:

- 📚 **Course & Lesson Management** - Browse and learn from structured content
- 🧩 **Interactive Challenges** - Solve code challenges with real-time feedback
- 📝 **Quizzes & Assessments** - Test knowledge with interactive quizzes
- 🤖 **AI-Powered Features** - AI tutor and personalized roadmaps
- 💬 **Community Engagement** - Comments, discussions, and code reviews
- 📊 **Analytics Dashboard** - Track progress and achievements
- 💳 **Payment Integration** - ZaloPay subscription management
- 🎮 **Gamification** - XP system, leaderboards, and streaks

---

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 19.2.6 | UI library |
| **Language** | TypeScript | ~6.0.2 | Type safety |
| **Build Tool** | Vite | 8.0.12 | Fast bundling |
| **Styling** | TailwindCSS | 4.3.0 | Utility-first CSS |
| **PostCSS** | PostCSS | 8.5.14 | CSS processing |
| **Routing** | React Router | 7.15.0 | Client-side navigation |
| **HTTP Client** | Axios | 1.16.0 | API communication |
| **State (Server)** | TanStack Query | 5.100.10 | Server state management |
| **State (Client)** | Zustand | 5.0.13 | Client state management |
| **Data Viz** | Recharts | 3.8.1 | Charts & graphs |
| **Icons** | Lucide React | 1.14.0 | Icon components |
| **Linting** | ESLint | 10.3.0 | Code quality |
| **Type Checking** | TypeScript | ~6.0.2 | Static analysis |

---

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/                          # Reusable UI components
│   │   ├── Layout.tsx                       # Main layout wrapper
│   │   ├── Navbar.tsx                       # Navigation bar
│   │   ├── CodeChallengeTest.tsx            # Code challenge component
│   │   ├── CoursePaymentDialog.tsx          # Payment dialog
│   │   ├── QuizTest.tsx                     # Quiz component
│   │   │
│   │   ├── dashboard/                       # Dashboard components
│   │   │   ├── HeatmapActivity.tsx          # Activity heatmap
│   │   │   ├── Leaderboard.tsx              # Leaderboard display
│   │   │   ├── PersonalGoals.tsx            # User goals
│   │   │   ├── PremiumBanner.tsx            # Premium promo
│   │   │   ├── QuickAccess.tsx              # Quick links
│   │   │   ├── RoadmapSection.tsx           # Learning roadmaps
│   │   │   ├── Sidebar.tsx                  # Navigation sidebar
│   │   │   ├── SkillsSection.tsx            # Skills display
│   │   │   ├── StatsCard.tsx                # Statistics card
│   │   │   ├── StatsGrid.tsx                # Stats dashboard
│   │   │   └── WelcomeBanner.tsx            # Welcome message
│   │   │
│   │   └── roadmaps/                        # Roadmap components
│   │       └── CourseCard.tsx               # Course card display
│   │
│   ├── pages/                               # Route pages (Next.js-like structure)
│   │   ├── Home.tsx                         # Dashboard home page
│   │   ├── Login.tsx                        # Login page
│   │   ├── Register.tsx                     # Registration page
│   │   ├── OtpVerification.tsx              # OTP verification
│   │   ├── Profile.tsx                      # User profile
│   │   ├── ProfileEdit.tsx                  # Edit profile
│   │   ├── ProfilePublic.tsx                # Public profile view
│   │   ├── Roadmaps.tsx                     # Courses/roadmaps listing
│   │   ├── CourseDetail.tsx                 # Course detail page
│   │   ├── LessonDetail.tsx                 # Lesson content page
│   │   ├── Study.tsx                        # Study dashboard
│   │   ├── StudySession.tsx                 # Active study session
│   │   ├── AiTutor.tsx                      # AI tutor interface
│   │   ├── Interview.tsx                    # Interview listing
│   │   ├── InterviewDetail.tsx              # Interview detail
│   │   ├── InterviewTest.tsx                # Interview test page
│   │   ├── InterviewResult.tsx              # Interview results
│   │   ├── Subscription.tsx                 # Subscription page
│   │   └── PaymentHistory.tsx               # Payment history
│   │
│   ├── store/                               # Zustand state stores
│   │   └── authStore.ts                     # Authentication state
│   │
│   ├── config/                              # Configuration files
│   │   └── axiosClient.ts                   # Axios instance & interceptors
│   │
│   ├── assets/                              # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── App.tsx                              # Root app component
│   ├── App.css                              # App-level styles
│   ├── main.tsx                             # Entry point
│   └── index.css                            # Global styles
│
├── public/                                  # Static files (favicon, etc)
│
├── .env.example                             # Environment template
├── .env.local                               # Local environment (gitignored)
├── .gitignore                               # Git ignore rules
├── eslint.config.js                         # ESLint configuration
├── postcss.config.js                        # PostCSS configuration
├── tailwind.config.ts                       # TailwindCSS configuration
├── tsconfig.json                            # TypeScript config (shared)
├── tsconfig.app.json                        # TypeScript config (app)
├── tsconfig.node.json                       # TypeScript config (build)
├── vite.config.ts                           # Vite configuration
├── package.json                             # Dependencies & scripts
├── package-lock.json                        # Dependency lock file
├── index.html                               # HTML entry point
├── README.md                                # This file
└── Dockerfile                               # Docker configuration
```

---

## 📋 Prerequisites

Before setting up the frontend, ensure you have:

- **Node.js** ≥ 16.x (LTS recommended)
  ```bash
  node --version
  # Should output: v18.x.x, v20.x.x, or higher
  ```

- **npm** ≥ 8.x or **pnpm** ≥ 7.x
  ```bash
  npm --version
  # or
  pnpm --version
  ```

- **Backend API** running on `http://localhost:8080`

- **Git** (for version control)

---

## 🚀 Installation & Setup

### Step 1: Navigate to Frontend Directory

```bash
cd Learning-Web/Frontend
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using pnpm (faster)
pnpm install

# Or using yarn
yarn install
```

### Step 3: Configure Environment

Create `.env.local` file:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Learning-VN

# API Timeout (milliseconds)
VITE_TIMEOUT=30000

# Enable Debugging
VITE_DEBUG=false
```

**Available Environment Variables:**

```env
# API
VITE_API_BASE_URL          # Backend API base URL
VITE_API_TIMEOUT           # Request timeout in ms
VITE_API_RETRY_COUNT       # Auto retry failed requests

# App
VITE_APP_NAME              # Application name
VITE_APP_VERSION           # Application version
VITE_DEBUG                 # Enable debug logs

# Features (Flags)
VITE_ENABLE_DARK_MODE      # Dark mode support
VITE_ENABLE_ANALYTICS      # Analytics tracking
VITE_ENABLE_CRASH_REPORTS  # Error reporting
```

---

## 💻 Development

### Start Development Server

```bash
npm run dev
```

This will start Vite dev server with:
- 🔄 Hot Module Replacement (HMR)
- ⚡ Instant page reloads
- 🎯 Source maps for debugging

**Access at:** http://localhost:5173

### Available npm Scripts

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm run build:analyze    # Analyze bundle size

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run type-check       # Check TypeScript types

# Testing
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Preview
npm run preview          # Preview production build
```

### Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes**
   ```bash
   npm run dev  # Auto-reload on save
   ```

3. **Check code quality**
   ```bash
   npm run lint
   npm run lint:fix
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: Add my feature"
   git push origin feature/my-feature
   ```

---

## 🏗️ Build & Deployment

### Development Build

```bash
npm run build
```

Creates optimized build in `dist/` folder:
- Code splitting
- CSS minification
- JS minification
- Source maps

### Production Build

```bash
# Build with environment variables
VITE_API_BASE_URL=https://api.learning-vn.com npm run build
```

### Preview Production Build

```bash
npm run preview
```

Serves production build locally for testing.

### Deployment Options

#### Option 1: Static Hosting (Vercel, Netlify)

```bash
# Vercel
vercel deploy

# Netlify
netlify deploy --prod --dir=dist
```

#### Option 2: Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t learning-frontend .
docker run -p 3000:80 learning-frontend
```

#### Option 3: Docker Compose

```yaml
# docker-compose.yml (in project root)
services:
  frontend:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      VITE_API_BASE_URL: http://backend:8080/api
    depends_on:
      - backend
```

---

## 🎨 Component Architecture

### Component Types

#### 1. **Page Components**
- Route-level components
- Handle data fetching
- Location: `src/pages/`

```typescript
// src/pages/CourseDetail.tsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => api.getCourse(courseId!)
  })

  if (isLoading) return <Loading />
  return <CourseContent course={data} />
}
```

#### 2. **Layout Components**
- Wrapper components
- Consistent layout structure
- Location: `src/components/`

```typescript
// src/components/Layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
```

#### 3. **Feature Components**
- Reusable UI components
- Handle specific features
- Location: `src/components/`

```typescript
// src/components/QuizTest.tsx
interface QuizTestProps {
  quizId: string
  onComplete: (score: number) => void
}

export default function QuizTest({ quizId, onComplete }: QuizTestProps) {
  const [answers, setAnswers] = useState({})
  
  const handleSubmit = async () => {
    const result = await api.submitQuiz(quizId, answers)
    onComplete(result.score)
  }

  return (
    <div className="quiz-container">
      {/* Quiz content */}
    </div>
  )
}
```

### Component Best Practices

```typescript
// ✅ Good: Typed props, clear name
interface UserCardProps {
  userId: string
  onSelect?: (id: string) => void
}

export function UserCard({ userId, onSelect }: UserCardProps) {
  return <div onClick={() => onSelect?.(userId)}>...</div>
}

// ❌ Bad: No types, vague name
export function Card({ data, onClick }) {
  return <div onClick={onClick}>{data}</div>
}
```

---

## 🎛️ State Management

### Zustand (Client State)

Zustand is used for client-side state (auth, UI state):

```typescript
// src/store/authStore.ts
import { create } from 'zustand'

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const res = await api.login(email, password)
      set({ token: res.token, user: res.user })
      localStorage.setItem('token', res.token)
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    set({ token: null, user: null })
    localStorage.removeItem('token')
  }
}))
```

Usage:
```typescript
function LoginPage() {
  const { login, isLoading } = useAuthStore()
  
  const handleLogin = async (email: string, password: string) => {
    await login(email, password)
    navigate('/dashboard')
  }

  return (
    <form onSubmit={() => handleLogin(email, password)}>
      {/* Form fields */}
    </form>
  )
}
```

### TanStack Query (Server State)

React Query manages server data (courses, lessons, etc.):

```typescript
// Fetch data
const { data: courses, isLoading } = useQuery({
  queryKey: ['courses'],
  queryFn: () => api.getCourses(),
  staleTime: 5 * 60 * 1000  // 5 minutes
})

// Mutate data
const { mutate: enrollCourse } = useMutation({
  mutationFn: (courseId: string) => api.enrollCourse(courseId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['courses'] })
  }
})
```

---

## 🔌 API Integration

### Axios Client Setup

```typescript
// src/config/axiosClient.ts
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: import.meta.env.VITE_TIMEOUT || 30000
})

// Request interceptor - Add token to headers
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - Handle errors
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosClient
```

### API Service Example

```typescript
// src/services/courseApi.ts
import axiosClient from '@/config/axiosClient'

export const courseApi = {
  getCourses: () => 
    axiosClient.get('/courses'),

  getCourseDetail: (courseId: string) =>
    axiosClient.get(`/courses/${courseId}`),

  enrollCourse: (courseId: string) =>
    axiosClient.post(`/courses/${courseId}/enroll`, {}),

  submitQuiz: (quizId: string, answers: Record<string, string>) =>
    axiosClient.post(`/quizzes/${quizId}/submit`, { answers }),

  submitCode: (challengeId: string, code: string, language: string) =>
    axiosClient.post(`/challenges/${challengeId}/process`, {
      language,
      submittedCode: code,
      isAiAnalysis: false
    })
}
```

### Using APIs in Components

```typescript
function CourseList() {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: courseApi.getCourses
  })

  if (isLoading) return <Skeleton />
  if (error) return <Error message={error.message} />

  return (
    <div className="grid grid-cols-3 gap-4">
      {courses?.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
```

---

## 🎨 Styling Guide

### TailwindCSS Conventions

```typescript
// ✅ Good: Use Tailwind utility classes
function Button() {
  return (
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      Click me
    </button>
  )
}

// ❌ Avoid: Custom CSS when possible
const styles = css`
  button {
    padding: 8px 16px;
    background: #2563eb;
    color: white;
  }
`
```

### Component Styling Pattern

```typescript
interface CardProps {
  className?: string
}

function Card({ className, children }: CardProps) {
  return (
    <div className={cn(
      "p-4 bg-white rounded-lg shadow-md",
      className
    )}>
      {children}
    </div>
  )
}

// Usage with additional styles
<Card className="border-2 border-blue-500" />
```

### Dark Mode Support

```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1f2937',
          text: '#f3f4f6'
        }
      }
    }
  }
}

// Usage
<div className="bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text">
  Content
</div>
```

---

## ⚡ Performance Optimization

### Code Splitting

```typescript
import { lazy, Suspense } from 'react'

const CourseDetail = lazy(() => import('@/pages/CourseDetail'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <CourseDetail />
    </Suspense>
  )
}
```

### Image Optimization

```typescript
// ✅ Good: Lazy load images
<img 
  src={course.thumbnail}
  alt={course.title}
  loading="lazy"
  decoding="async"
  srcSet={`${course.thumbnail}?w=300 300w, ${course.thumbnail}?w=600 600w`}
/>
```

### Query Optimization

```typescript
// ✅ Stale time prevents unnecessary refetches
useQuery({
  queryKey: ['courses'],
  queryFn: getCourses,
  staleTime: 5 * 60 * 1000  // 5 minutes
})

// ✅ Pagination for large lists
useQuery({
  queryKey: ['courses', page],
  queryFn: () => getCourses({ page, limit: 20 })
})
```

### Bundle Analysis

```bash
npm run build:analyze
# Visualize bundle size
```

---

## 🧪 Testing

### Unit Tests

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### Integration Tests

```typescript
// src/__tests__/auth.integration.test.tsx
describe('Authentication Flow', () => {
  it('should login and redirect to dashboard', async () => {
    render(<App />)
    
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard')
    })
  })
})
```

### Running Tests

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

---

## 🐛 Troubleshooting

### Port 5173 Already in Use

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5173
kill -9 <PID>
```

### Backend Connection Error

```
Error: Cannot connect to http://localhost:8080
```

**Solutions:**
1. Verify backend is running: `curl http://localhost:8080/api/auth/health`
2. Check `.env.local` has correct `VITE_API_BASE_URL`
3. Verify CORS is enabled in backend

### TypeScript Errors

```bash
# Check for type errors
npm run type-check

# Fix common issues
npm run lint:fix
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### HMR Not Working

```typescript
// vite.config.ts - Force HMR
export default defineConfig({
  server: {
    hmr: {
      host: 'localhost',
      port: 5173
    }
  }
})
```

---

## 📝 Contributing

### Code Style

- Use **TypeScript** for all new code
- Follow **React hooks** best practices
- Use **TailwindCSS** for styling
- Add types for all functions and components

### Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] Types are correct (`npm run type-check` passes)
- [ ] Linting passes (`npm run lint` passes)
- [ ] Tests added/updated
- [ ] Changes documented
- [ ] No console errors/warnings

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
npm run lint:fix

# Commit
git commit -m "feat: Add amazing feature"

# Push
git push origin feature/my-feature

# Create PR on GitHub
```

---

## 📊 Performance Metrics

### Target Metrics

- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 250KB (gzipped)

### Monitor Performance

```bash
# Lighthouse audit
npm run build
npx lighthouse http://localhost:3000 --view
```

---

## 📞 Support & Resources

- 📖 [React Documentation](https://react.dev)
- 🎨 [TailwindCSS Docs](https://tailwindcss.com)
- ⚡ [Vite Guide](https://vitejs.dev)
- 🔄 [React Query](https://tanstack.com/query/latest)
- 🏪 [Zustand](https://github.com/pmndrs/zustand)

---

## 📄 License

MIT License - see LICENSE file for details

---

<div align="center">

**Built with ❤️ using React, TypeScript & TailwindCSS**

[Back to Top ↑](#-learning-platform-frontend---react-typescript)

</div>
