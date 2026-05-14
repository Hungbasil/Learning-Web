import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { BookOpen, ArrowLeft, Play } from 'lucide-react'

export default function Stories() {
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
            <BookOpen className="w-7 h-7 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Truyện Học Tập</h1>
          </div>
          <p className="text-gray-600 mt-2">Học qua những câu chuyện thực tế và có tính giáo dục</p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 h-40 flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-all">
                <BookOpen className="w-12 h-12 text-purple-600 opacity-50" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Truyện {item}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Câu chuyện hấp dẫn về lập trình và công nghệ
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">15 phút đọc</span>
                  <button className="px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    Đọc
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
