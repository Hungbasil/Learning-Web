import { Zap, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function PremiumBanner() {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 rounded-2xl p-5 md:p-6 shadow-lg border border-orange-300 overflow-hidden relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-8 -mt-8 animate-pulse"></div>

      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-4">
          <Zap className="w-6 h-6 md:w-7 md:h-7 text-white flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white">Nâng cấp Premium</h3>
            <p className="text-xs md:text-sm text-white/90 mt-1">
              Mở khóa các tính năng nâng cao và nhận thêm lượt AI Tutor
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-5 text-sm text-white/95">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <span>Lượt AI Tutor không giới hạn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <span>Hỗ trợ ưu tiên từ giáo viên</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <span>Sertifikat nâng cao</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/payment')}
          className="w-full bg-white text-orange-600 font-bold py-2.5 md:py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 group transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          Nâng cấp ngay
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
