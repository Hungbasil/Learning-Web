import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { Heart, Share2 } from 'lucide-react'

interface PublicProfile {
  id: number
  fullName: string
  email: string
  level: number
  totalXp: number
  streak: number
  joinDate: string
  achievements: Array<{
    id: number
    title: string
    icon: string
  }>
}

export default function ProfilePublic() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch public profile from API
    // For now, using mock data
    setTimeout(() => {
      setProfile({
        id: parseInt(userId || '0'),
        fullName: 'Khải Hùng Nguyễn',
        email: 'khaihung@example.com',
        level: 1,
        totalXp: 100,
        streak: 1,
        joinDate: '2026-05-28',
        achievements: [
          { id: 1, title: '1 Thông thưởng', icon: '⭐' },
        ],
      })
      setIsLoading(false)
    }, 500)
  }, [userId])

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-gray-600">Đang tải...</div>
        </div>
      </Layout>
    )
  }

  if (!profile) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Hồ sơ không tìm thấy</h1>
            <button
              onClick={() => navigate('/profile')}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Quay lại hồ sơ
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-200 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {profile.level}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile.fullName}</h1>
                <p className="text-gray-500 text-sm">Thành viên từ {new Date(profile.joinDate).toLocaleDateString('vi-VN')}</p>
                <p className="text-gray-500 text-sm">0 lượt xem</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isLiked
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Chuỗi hiện tại</div>
              <div className="text-2xl font-bold text-blue-600">{profile.streak}</div>
              <div className="text-xs text-gray-500 mt-1">ngày</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Tổng XP</div>
              <div className="text-2xl font-bold text-purple-600">{profile.totalXp}</div>
              <div className="text-xs text-gray-500 mt-1">XP</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Cấp độ</div>
              <div className="text-2xl font-bold text-green-600">{profile.level}</div>
              <div className="text-xs text-gray-500 mt-1">Level</div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Thành tích</h2>
          <div className="grid grid-cols-1 gap-4">
            {profile.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-4"
              >
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Ranking */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Xếp hạng tuần</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">#105</div>
            <p className="text-gray-600">Người dùng này xếp hạng #105 tuần này.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
