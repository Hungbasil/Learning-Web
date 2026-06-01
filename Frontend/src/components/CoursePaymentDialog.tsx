import { useNavigate } from 'react-router-dom'
import { X, Lock, Zap } from 'lucide-react'

interface CoursePaymentDialogProps {
  isOpen: boolean
  onClose: () => void
  courseTitle: string
  coursePrice: number
  onUpgradePremium: () => void
  onPayForCourse: () => void
  loading?: boolean
}

export function CoursePaymentDialog({
  isOpen,
  onClose,
  courseTitle,
  coursePrice,
  onUpgradePremium,
  onPayForCourse,
  loading = false
}: CoursePaymentDialogProps) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-700 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          
          <Lock className="w-12 h-12 text-white mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Khóa học bị khoá</h2>
          <p className="text-indigo-100">{courseTitle}</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-gray-600 mb-6">
            Để truy cập khóa học này, bạn cần nâng cấp Premium hoặc thanh toán trực tiếp.
          </p>

          {/* Options */}
          <div className="space-y-4">
            {/* Option 1: Premium */}
            <button
              onClick={onUpgradePremium}
              disabled={loading}
              className="w-full p-4 border-2 border-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg mt-1">
                  <Zap className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Nâng cấp Premium</p>
                  <p className="text-sm text-gray-600">Truy cập toàn bộ khóa học không giới hạn</p>
                  <p className="text-xs text-indigo-600 font-medium mt-1">Từ 99.000đ/tháng</p>
                </div>
              </div>
            </button>

            {/* Option 2: Pay for Course */}
            <button
              onClick={onPayForCourse}
              disabled={loading}
              className="w-full p-4 border-2 border-green-600 rounded-xl hover:bg-green-50 transition-colors disabled:opacity-50 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg mt-1">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Thanh toán trực tiếp</p>
                  <p className="text-sm text-gray-600">Mua riêng khóa học này</p>
                  <p className="text-sm text-green-600 font-bold mt-1">{formatVND(coursePrice)}</p>
                </div>
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">hoặc</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Để sau
          </button>

          {/* Info Text */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Bạn luôn có thể quay lại nâng cấp sau
          </p>
        </div>
      </div>
    </div>
  )
}
