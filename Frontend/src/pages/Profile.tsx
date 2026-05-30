import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { Edit, Eye, Crown, Zap } from 'lucide-react'

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  // Calculate level based on XP
  const level = Math.floor((user.totalXp || 0) / 100) + 1
  const currentLevelXp = (user.totalXp || 0) % 100

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-200 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {level}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
                <p className="text-gray-500 text-sm">@{user.email.split('@')[0]}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm text-gray-600">Cấp độ {level}</span>
                  <span className="text-sm text-orange-600 font-semibold">{currentLevelXp} / 100 XP</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/profile/edit')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                <Edit size={18} />
                Chỉnh sửa hồ sơ
              </button>
              <button
                onClick={() => navigate(`/profile/${user.id}/public`)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                <Eye size={18} />
                Xem công khai
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-1">Chuỗi hôm tháo</div>
              <div className="text-2xl font-bold text-blue-600">1 ngày</div>
              <div className="text-xs text-gray-500 mt-1">Có liên</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-1">Chuỗi dài nhất</div>
              <div className="text-2xl font-bold text-purple-600">1 ngày</div>
              <div className="text-xs text-gray-500 mt-1">Kỳ lực cá nhân</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-1">Tất cả thời gian XP</div>
              <div className="text-2xl font-bold text-green-600">{user.totalXp || 0} XP</div>
              <div className="text-xs text-gray-500 mt-1">Tổng kiếm được</div>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Crown size={20} className="text-yellow-500" />
            Đăng ký Premium
          </h2>
          {user.isPremium ? (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
              <div className="flex items-center gap-3">
                <Crown size={24} className="text-yellow-300" />
                <div>
                  <h3 className="font-bold">Premium Active</h3>
                  <p className="text-sm opacity-90">
                    Hết hạn: {new Date(user.premiumExpiryDate || '').toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Mở khóa tính năng Premium</h3>
                  <p className="text-sm text-gray-600">
                    Nâng cấp lên Premium để truy cập các khóa học độc quyền, loại bỏ quảng cáo và hơn thế nữa!
                  </p>
                </div>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap ml-4">
                  Nâng cấp
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Token Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap size={20} className="text-yellow-500" />
            Token AI
          </h2>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600">Số Token hiện có</div>
              <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold">
                Mua Token
              </button>
            </div>
            <div className="text-4xl font-bold text-yellow-600 mb-2">
              {user.aiTokens || 0}
            </div>
            <p className="text-sm text-gray-600">/ 100,000 token</p>
            <div className="mt-4 bg-white rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full"
                style={{ width: `${Math.min((user.aiTokens || 0) / 1000, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Xếp hạng tuần</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">#105</div>
            <p className="text-gray-600">Người dùng này xếp hạng #105 tuần này.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
