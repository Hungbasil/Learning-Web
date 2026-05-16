import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { MapPin, ArrowLeft } from 'lucide-react'

export default function Roadmaps() {
  const { token, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
    }
  }, [token, user, navigate])

  if (!token || !user) {
    return null
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <div className="flex items-center gap-3">
            <MapPin className="w-7 h-7 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Duyệt Khóa Học</h1>
          </div>
          <p className="text-gray-600 mt-2">Chọn Khóa học tập phù hợp với kỹ năng của bạn</p>
        </div>

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <MapPin className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Khóa Học {item}</h3>
              <p className="text-sm text-gray-600 mb-4">Mô tả Khóa học toàn diện</p>
              <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors w-full">
                Xem Chi Tiết
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
