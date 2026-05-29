import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { ArrowLeft, Check, X } from 'lucide-react'
import axiosClient from '@/config/axiosClient'

interface PricingPlan {
  months: number
  name: string
  price: number
  savings: number
  features: string[]
  recommended: boolean
}

const PRICING_PLANS: PricingPlan[] = [
  {
    months: 1,
    name: 'Thử nghiệm 1 tháng',
    price: 99000,
    savings: 0,
    features: [
      'Truy cập toàn bộ khóa học',
      '5 phiên phỏng vấn/tuần',
      'Hỗ trợ AI Mentor',
      'Chứng chỉ hoàn thành'
    ],
    recommended: false
  },
  {
    months: 3,
    name: 'Pro 3 tháng',
    price: 297000,
    savings: 10,
    features: [
      'Truy cập toàn bộ khóa học',
      '10 phiên phỏng vấn/tuần',
      'Phân tích code chi tiết',
      'Hỗ trợ ưu tiên',
      'Chứng chỉ hoàn thành',
      'Tải tài liệu'
    ],
    recommended: true
  },
  {
    months: 6,
    name: 'Pro+ 6 tháng',
    price: 594000,
    savings: 20,
    features: [
      'Truy cập toàn bộ khóa học',
      'Phiên phỏng vấn không giới hạn',
      'Phân tích code chi tiết',
      'Hỗ trợ ưu tiên 24/7',
      'Chứng chỉ hoàn thành',
      'Tải tài liệu + Video',
      'Tư vấn career 1-1'
    ],
    recommended: false
  },
  {
    months: 12,
    name: 'Premium 1 năm',
    price: 1188000,
    savings: 30,
    features: [
      'Truy cập toàn bộ khóa học',
      'Phiên phỏng vấn không giới hạn',
      'Phân tích code chi tiết',
      'Hỗ trợ ưu tiên 24/7',
      'Chứng chỉ hoàn thành',
      'Tải tài liệu + Video',
      'Tư vấn career 1-1',
      'Badge Exclusive',
      'Lịch sử thanh toán'
    ],
    recommended: false
  }
]

export default function Subscription() {
  const { token, user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!token || !user) {
    navigate('/login')
    return null
  }

  const handleUpgrade = async (months: number) => {
    setLoading(true)
    setError('')
    try {
      const response = await axiosClient.post(`/payment/premium/${months}`)
      if (response.data.payUrl) {
        window.location.href = response.data.payUrl
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tạo thanh toán')
      setLoading(false)
    }
  }

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const monthlyPrice = (price: number, months: number) => {
    return Math.round(price / months)
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nâng cấp Premium</h1>
          <p className="text-lg text-gray-600">Mở khóa tất cả tính năng và học không giới hạn</p>
          {user.isPremium && (
            <div className="mt-4 inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              ✓ Bạn đã là thành viên Premium
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.months}
              className={`relative rounded-2xl overflow-hidden transition-all ${
                plan.recommended
                  ? 'ring-2 ring-orange-400 shadow-xl scale-105'
                  : 'border border-gray-200'
              } ${plan.recommended ? 'bg-white' : 'bg-gray-50'}`}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-center py-2 text-sm font-bold">
                  ⭐ PHỔ BIẾN NHẤT
                </div>
              )}

              <div className={`p-6 ${plan.recommended ? 'pt-16' : ''}`}>
                {/* Discount Badge */}
                {plan.savings > 0 && (
                  <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                    Tiết kiệm {plan.savings}%
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl font-bold text-indigo-600">
                    {formatVND(plan.price)}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {formatVND(monthlyPrice(plan.price, plan.months))}/tháng
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(plan.months)}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-bold transition-all mb-6 ${
                    plan.recommended
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:shadow-lg'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Đang xử lý...' : 'Nâng cấp ngay'}
                </button>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">So sánh gói</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-gray-300">
                <tr>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Tính năng</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-900">Free</th>
                  <th className="text-center py-3 px-4 font-bold text-indigo-600">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Khóa học cơ bản', free: true, premium: true },
                  { feature: 'Phiên phỏng vấn', free: '3/tuần', premium: 'Không giới hạn' },
                  { feature: 'Phân tích code chi tiết', free: false, premium: true },
                  { feature: 'AI Mentor 24/7', free: false, premium: true },
                  { feature: 'Tư vấn Career 1-1', free: false, premium: true },
                  { feature: 'Tải tài liệu', free: false, premium: true },
                  { feature: 'Chứng chỉ', free: false, premium: true },
                  { feature: 'Tính năng nâng cao', free: false, premium: true }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-4 px-4 text-gray-700 font-medium">{row.feature}</td>
                    <td className="text-center py-4 px-4">
                      {typeof row.free === 'boolean' ? (
                        row.free ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600">{row.free}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Câu hỏi thường gặp</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Tôi có thể hủy đăng ký bất cứ lúc nào không?',
                a: 'Có, bạn có thể hủy đăng ký Premium bất cứ lúc nào. Bạn sẽ mất quyền truy cập sau khi gói hết hạn.'
              },
              {
                q: 'Có hoàn tiền không?',
                a: 'Chúng tôi cung cấp hoàn tiền 100% nếu bạn không hài lòng trong 7 ngày đầu tiên.'
              },
              {
                q: 'Thanh toán có an toàn không?',
                a: 'Có, chúng tôi sử dụng ZaloPay - cổng thanh toán an toàn và được tin cậy nhất ở Việt Nam.'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
