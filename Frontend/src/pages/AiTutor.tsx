import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { Bot, ArrowLeft, MessageSquare } from 'lucide-react'

export default function AiTutor() {
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
      <div className="max-w-4xl mx-auto px-3 md:px-6 py-6 md:py-8">
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
            <Bot className="w-7 h-7 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Gia Sư AI</h1>
          </div>
          <p className="text-gray-600 mt-2">Nhận hỗ trợ học tập từ AI tutor 24/7</p>
        </div>

        {/* Chat Interface Placeholder */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Chat với AI Tutor</h2>
            <p className="text-sm text-gray-600">Đã dùng: {user.aiTokens || 0} / 10 lượt</p>
          </div>

          {/* Chat Area */}
          <div className="h-96 bg-gray-50 overflow-y-auto p-6 space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm flex-shrink-0">
                AI
              </div>
              <div className="bg-white rounded-lg p-4 max-w-xs border border-gray-200">
                <p className="text-sm text-gray-700">
                  Xin chào! Tôi là AI Tutor của bạn. Hỏi tôi bất kỳ câu hỏi nào về lập trình, toán học, hoặc các môn học khác!
                </p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Hỏi AI Tutor của bạn..."
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                disabled
              />
              <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Mẹo sử dụng</h3>
          <p className="text-sm text-blue-800">
            AI Tutor có thể giúp bạn giải thích bài học, phân tích code, và trả lời các câu hỏi học tập. Mỗi lần chat sẽ tiêu tốn 1 lượt AI Token.
          </p>
        </div>
      </div>
    </Layout>
  )
}
