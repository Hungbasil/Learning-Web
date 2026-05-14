import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { axiosClient } from '@/config/axiosClient'

interface RegisterRequest {
  fullName: string
  email: string
  password: string
}

interface RegisterResponse {
  message: string
  success: boolean
}

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const validatePassword = (pwd: string): boolean => {
    return pwd.length >= 6
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Vui lòng điền đầy đủ tất cả các trường')
      return
    }

    if (!validateEmail(email)) {
      setError('Email không hợp lệ')
      return
    }

    if (!validatePassword(password)) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    try {
      setLoading(true)
      const payload: RegisterRequest = {
        fullName: name,
        email,
        password,
      }

      await axiosClient.post<RegisterResponse>('/auth/register', payload)

      setSuccess(true)
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      // Redirect to OTP verification after 1.5 seconds
      setTimeout(() => {
        navigate('/otp-verification', { state: { email } })
      }, 1500)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-3 md:p-4 relative overflow-hidden animate-fade-in">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow"></div>
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      
      <div className="w-full max-w-[320px] relative z-10 animate-fade-in">
        {/* Card Container */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 animate-slide-up">
          {/* Header */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-200 to-cyan-200 bg-clip-text text-transparent mb-1">Đăng ký</h1>
            <p className="text-purple-200/70 text-xs md:text-sm">Tạo tài khoản Learning VN của bạn</p>
          </div>

          {/* Success Alert */}
          {success && (
            <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-center gap-2 animate-slide-down">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-200 text-xs md:text-sm">Đăng ký thành công! Đang chuyển sang xác thực Email...</p>
            </div>
          )}

          {/* Error Alert */}
          {error && !success && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 animate-slide-down">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-xs md:text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Name Input */}
            <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <label htmlFor="name" className="block text-xs font-medium text-purple-200 mb-1">
                Họ và tên
              </label>
              <div className="relative group">
                <User className="absolute left-2.5 top-2.5 w-4 h-4 text-purple-300/50 group-focus-within:text-cyan-300 transition-colors" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  disabled={loading || success}
                  className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed focus:animate-input-glow"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="animate-slide-up" style={{ animationDelay: '0.18s' }}>
              <label htmlFor="email" className="block text-xs font-medium text-purple-200 mb-1">
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
                  disabled={loading || success}
                  className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed focus:animate-input-glow"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="animate-slide-up" style={{ animationDelay: '0.21s' }}>
              <label htmlFor="password" className="block text-xs font-medium text-purple-200 mb-1">
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
                  disabled={loading || success}
                  className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed focus:animate-input-glow"
                />
              </div>
              <p className="mt-0.5 text-xs text-purple-200/50">Tối thiểu 6 ký tự</p>
            </div>

            {/* Confirm Password Input */}
            <div className="animate-slide-up" style={{ animationDelay: '0.24s' }}>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-purple-200 mb-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative group">
                <Lock className="absolute left-2.5 top-2.5 w-4 h-4 text-purple-300/50 group-focus-within:text-cyan-300 transition-colors" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading || success}
                  className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed focus:animate-input-glow"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 transform hover:scale-105 active:animate-button-pop text-sm animate-slide-up"
              style={{ animationDelay: '0.27s' }}
              onMouseDown={(e) => e.currentTarget.classList.add('animate-button-pop')}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Thành công!</span>
                </>
              ) : (
                'Đăng ký'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-4 text-center text-purple-200/70 text-xs md:text-sm animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Đã có tài khoản?{' '}
            <a href="/login" className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors hover:underline">
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
