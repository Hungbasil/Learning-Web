import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { Users, ArrowLeft, Plus } from 'lucide-react'

export default function Study() {
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
            <Users className="w-7 h-7 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Học Cùng Tôi</h1>
          </div>
          <p className="text-gray-600 mt-2">Tham gia nhóm học tập cùng những học viên khác</p>
        </div>

        {/* Create Group Button */}
        <div className="mb-8">
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
            <Plus className="w-5 h-5" />
            Tạo Nhóm Học
          </button>
        </div>

        {/* Study Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  {item}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Nhóm Học {item}</h3>
                  <p className="text-xs text-gray-500">{5 + item} thành viên</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Nhóm học tập cho môn Lập trình Python
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">Hoạt động hôm nay</span>
                <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                  Tham gia
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
