import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { axiosClient } from '@/config/axiosClient'

interface OtpVerifyRequest {
  email: string
  otpCode: string
}

export default function OtpVerification() {
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes = 300 seconds
  const [canResend, setCanResend] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get email from location state (after register) or URL query params (after email link click)
  const searchParams = new URLSearchParams(location.search)
  const urlEmail = searchParams.get('email') || ''
  const email = (location.state as any)?.email || urlEmail || ''

  // Timer for OTP expiry
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!otpCode.trim()) {
      setError('Vui lòng nhập mã xác thực')
      return
    }

    if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
      setError('Mã xác thực phải là 6 chữ số')
      return
    }

    if (timeLeft <= 0) {
      setError('Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại')
      return
    }

    try {
      setLoading(true)
      const payload: OtpVerifyRequest = {
        email,
        otpCode,
      }

      await axiosClient.post('/auth/verify-otp', payload)

      setSuccess(true)
      setOtpCode('')

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { state: { showVerificationMessage: true, email } })
      }, 2000)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Xác thực OTP thất bại. Vui lòng thử lại')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError('')
    setLoading(true)

    try {
      // Call register endpoint again to resend OTP
      await axiosClient.post('/auth/register', {
        email,
        password: '',
        fullName: '',
      })

      setTimeLeft(300) // Reset timer to 5 minutes
      setCanResend(false)
      setOtpCode('')
      // Show success message
      const successDiv = document.createElement('div')
      successDiv.className =
        'fixed top-4 right-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4 text-emerald-200 z-50'
      successDiv.textContent = 'OTP đã được gửi lại đến email của bạn'
      document.body.appendChild(successDiv)
      setTimeout(() => successDiv.remove(), 3000)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Lỗi khi gửi lại OTP. Vui lòng thử lại')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-3 md:p-4 relative overflow-hidden animate-fade-in">
        <div className="text-center text-white">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-lg mb-4">Email không hợp lệ</p>
          <a
            href="/register"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 rounded-lg font-semibold transition-all"
          >
            Quay lại đăng ký
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-3 md:p-4 relative overflow-hidden animate-fade-in">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow"></div>
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-[320px] relative z-10 animate-fade-in">
        {/* Card Container */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 animate-slide-up">
          {/* Header */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-200 to-cyan-200 bg-clip-text text-transparent mb-1">
              Xác thực Email
            </h1>
            <p className="text-purple-200/70 text-xs md:text-sm">
              Nhập mã 6 chữ số được gửi đến {email}
            </p>
          </div>

          {/* Success Alert */}
          {success && (
            <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-center gap-2 animate-slide-down">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-200 text-xs md:text-sm">
                Xác thực thành công! Đang chuyển hướng...
              </p>
            </div>
          )}

          {/* Error Alert */}
          {error && !success && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 animate-slide-down">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-xs md:text-sm">{error}</p>
            </div>
          )}

          {/* Timer */}
          {timeLeft > 0 && (
            <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg flex items-center gap-2 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <p className="text-blue-200 text-xs md:text-sm font-semibold">
                Hết hạn trong: {formatTime(timeLeft)}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {/* OTP Input */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label htmlFor="otp" className="block text-xs font-medium text-purple-200 mb-2">
                Mã xác thực
              </label>
              <div className="relative group">
                <Mail className="absolute left-2.5 top-2.5 w-4 h-4 text-purple-300/50 group-focus-within:text-cyan-300 transition-colors" />
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  value={otpCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setOtpCode(value)
                  }}
                  placeholder="000000"
                  disabled={loading || success}
                  maxLength={6}
                  className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed focus:animate-input-glow text-center tracking-widest"
                />
              </div>
              <p className="mt-1 text-xs text-purple-200/50">Nhập 6 chữ số</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success || otpCode.length !== 6}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 transform hover:scale-105 active:animate-button-pop text-sm animate-slide-up"
              style={{ animationDelay: '0.25s' }}
              onMouseDown={(e) => e.currentTarget.classList.add('animate-button-pop')}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Thành công!</span>
                </>
              ) : (
                'Xác thực'
              )}
            </button>
          </form>

          {/* Resend OTP Link */}
          <div className="mt-4 text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {canResend ? (
              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="text-cyan-300 hover:text-cyan-200 font-semibold text-xs md:text-sm transition-colors disabled:opacity-50"
              >
                Gửi lại OTP
              </button>
            ) : (
              <p className="text-purple-200/70 text-xs md:text-sm">
                Chưa nhận được mã?{' '}
                <span className="text-cyan-300 font-semibold">
                  Đợi để gửi lại
                </span>
              </p>
            )}
          </div>

          {/* Footer Link */}
          <p className="mt-4 text-center text-purple-200/70 text-xs md:text-sm animate-slide-up" style={{ animationDelay: '0.35s' }}>
            <a href="/register" className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors hover:underline">
              Quay lại đăng ký
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
