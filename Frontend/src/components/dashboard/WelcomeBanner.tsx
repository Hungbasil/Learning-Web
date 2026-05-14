import { useAuthStore } from '@/store/authStore'
import { Bot } from 'lucide-react'

export function WelcomeBanner() {
  const { user } = useAuthStore()
  const displayName = user?.email?.split('@')[0] || 'Học viên'

  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 shadow-sm border border-blue-100 mb-6 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-200">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left content */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Chào mừng trở lại, <span className="text-indigo-600">{displayName}</span>! 👋
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Tiếp tục học tập của bạn hôm nay và tiến gần hơn tới mục tiêu
          </p>
        </div>

        {/* Right AI mascot */}
        <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-md border border-indigo-100 flex-shrink-0">
          <Bot className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
          <div className="text-xs md:text-sm text-gray-700 font-medium">
            Gia sư AI luôn<br />đồng hành cùng bạn
          </div>
        </div>
      </div>
    </div>
  )
}
