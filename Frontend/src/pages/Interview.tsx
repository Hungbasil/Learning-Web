import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { Briefcase, ArrowLeft, Play } from 'lucide-react'

export default function Interview() {
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
            <Briefcase className="w-7 h-7 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Phòng Phỏng Vấn</h1>
          </div>
          <p className="text-gray-600 mt-2">Luyện tập phỏng vấn xin việc với hệ thống giả lập</p>
        </div>

        {/* Interview Sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
            >
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 h-40 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all">
                <Briefcase className="w-12 h-12 text-indigo-600 opacity-50" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Phỏng vấn {item}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Câu hỏi phỏng vấn cho vị trí Software Engineer
                </p>
                <button className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Bắt đầu
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
