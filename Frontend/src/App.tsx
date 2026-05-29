import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import OtpVerification from '@/pages/OtpVerification'
import Home from '@/pages/Home'
import Roadmaps from '@/pages/Roadmaps'
import CourseDetail from '@/pages/CourseDetail'
import LessonDetail from '@/pages/LessonDetail'
import AiTutor from '@/pages/AiTutor'
import Interview from '@/pages/Interview'
import InterviewDetail from '@/pages/InterviewDetail'
import InterviewTest from '@/pages/InterviewTest'
import InterviewResult from '@/pages/InterviewResult'
import Study from '@/pages/Study'
import StudySession from '@/pages/StudySession'
import Subscription from '@/pages/Subscription'
import PaymentHistory from '@/pages/PaymentHistory'
import { useAuthStore } from '@/store/authStore'
import { ArrowRight } from 'lucide-react'

function LandingOrHome() {
  const { token, user } = useAuthStore()
  
  // If authenticated, show dashboard; otherwise show landing page
  if (token && user) {
    return <Home />
  }
  return <HomePage />
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-3 md:p-4 relative overflow-hidden animate-fade-in">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10 text-center max-w-2xl lg:max-w-3xl animate-fade-in">
        {/* Main Content */}
        <div className="mb-6 md:mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent mb-2 md:mb-4 leading-tight">
            Learning VN
          </h1>
          <p className="text-xs sm:text-sm md:text-lg lg:text-xl text-purple-200/80 mb-4 md:mb-6 px-2">
            Nền tảng học tập trực tuyến tiên tiến với công nghệ AI
          </p>
          <div className="w-10 sm:w-12 md:w-16 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mx-auto"></div>
        </div>

        {/* Description */}
        <div className="mb-6 md:mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-purple-200/70 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed px-4">
            Khám phá hơn 1000+ khóa học chất lượng cao, được thiết kế bởi các chuyên gia hàng đầu.
            Học mọi lúc, mọi nơi với tốc độ của riêng bạn.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center animate-slide-up px-4" style={{ animationDelay: '0.3s' }}>
          <a
            href="/login"
            className="group px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 transform hover:scale-105 active:animate-button-pop flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
            onClick={(e) => {
              e.currentTarget.classList.add('animate-button-pop');
              setTimeout(() => e.currentTarget.classList.remove('animate-button-pop'), 600);
            }}
          >
            Đăng nhập
            <ArrowRight className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/register"
            className="group px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 backdrop-blur-md bg-white/10 border-2 border-white/30 hover:border-white/50 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-white/20 transform hover:scale-105 active:animate-button-pop flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
            onClick={(e) => {
              e.currentTarget.classList.add('animate-button-pop');
              setTimeout(() => e.currentTarget.classList.remove('animate-button-pop'), 600);
            }}
          >
            Đăng ký miễn phí
            <ArrowRight className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Stats */}
        <div className="mt-8 md:mt-12 lg:mt-16 grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 animate-slide-up px-4" style={{ animationDelay: '0.4s' }}>
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-2 sm:p-4 md:p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
            <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent mb-0.5 md:mb-2">50K+</div>
            <p className="text-purple-200/70 text-xs md:text-sm">Học viên tham gia</p>
          </div>
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-2 sm:p-4 md:p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
            <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent mb-0.5 md:mb-2">1000+</div>
            <p className="text-purple-200/70 text-xs md:text-sm">Khóa học</p>
          </div>
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-2 sm:p-4 md:p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
            <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent mb-0.5 md:mb-2">4.9★</div>
            <p className="text-purple-200/70 text-xs md:text-sm">Đánh giá</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingOrHome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/roadmaps" element={<Roadmaps />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonDetail />} />
        <Route path="/ai-tutor" element={<AiTutor />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/interview/:id" element={<InterviewDetail />} />
        <Route path="/interview/:id/test/:sessionId" element={<InterviewTest />} />
        <Route path="/interview/:id/result/:sessionId" element={<InterviewResult />} />
        <Route path="/study" element={<Study />} />
        <Route path="/study-session/:sessionId" element={<StudySession />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
