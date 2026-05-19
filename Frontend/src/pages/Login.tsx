import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react'
import { axiosClient } from '@/config/axiosClient'
import { useAuthStore } from '@/store/authStore'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    id: number
    email: string
    fullName: string
    role: string
    aiTokens: number
    totalXp: number
  }
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth } = useAuthStore()

  const fromOtpSuccess = location.state?.fromOtpSuccess
  const showVerificationMessage = location.state?.showVerificationMessage

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ email và mật khẩu')
      return
    }

    if (!validateEmail(email)) {
      setError('Email không hợp lệ')
      return
    }

    try {
      setLoading(true)
      const payload: LoginRequest = { email, password }
      const response = await axiosClient.post<LoginResponse>('/auth/login', payload)

      const { token, user } = response.data
      setAuth(token, user)
      
      // Đợi một chút để persist lưu token vào localStorage
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Redirect to home
      navigate('/')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Email hoặc mật khẩu không chính xác')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-3 md:p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow"></div>
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      
      <div className="w-full max-w-xs relative z-10 animate-fade-in">
        {/* Card Container */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 animate-slide-up">
          {/* Header */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-200 to-cyan-200 bg-clip-text text-transparent mb-1">Đăng nhập</h1>
            <p className="text-purple-200/70 text-xs md:text-sm">Chào mừng trở lại Learning VN</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 animate-slide-down">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-xs md:text-sm">{error}</p>
            </div>
          )}

          {/* Verification Success Message */}
          {showVerificationMessage && (
            <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-center gap-2 animate-slide-down">
              <AlertCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-200 text-xs md:text-sm">Email đã được xác thực! Bạn có thể đăng nhập ngay.</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email Input */}
            <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <label htmlFor="email" className="block text-xs font-medium text-purple-200 mb-1.5">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-2.5 top-2.5 w-4 h-4 text-purple-300/50 group-focus-within:text-cyan-300 transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  disabled={loading}
                  className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed focus:animate-input-glow"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label htmlFor="password" className="block text-xs font-medium text-purple-200 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative group">
                <Lock className="absolute left-2.5 top-2.5 w-4 h-4 text-purple-300/50 group-focus-within:text-cyan-300 transition-colors" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed focus:animate-input-glow"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 transform hover:scale-105 active:animate-button-pop text-sm animate-slide-up"
              style={{ animationDelay: '0.25s' }}
              onMouseDown={(e) => e.currentTarget.classList.add('animate-button-pop')}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-4 text-center text-purple-200/70 text-xs md:text-sm animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Chưa có tài khoản?{' '}
            <a href="/register" className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors hover:underline">
              Đăng ký tại đây
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
