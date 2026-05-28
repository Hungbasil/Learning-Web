import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { Briefcase, ArrowLeft, Play, Clock, HelpCircle, TrendingUp } from 'lucide-react'
import axiosClient from '@/config/axiosClient'

interface Interview {
  id: number
  title: string
  role: string
  field: string
  description: string
  durationMinutes: number
  totalQuestions: number
  passingScore: number
  xpReward: number
  difficulty: string
}

export default function InterviewDetail() {
  const { token, user } = useAuthStore()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  const [interview, setInterview] = useState<Interview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
      return
    }

    const fetchInterview = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get(`/interviews/${id}`)
        setInterview(response.data)
      } catch (err) {
        console.error('Lỗi khi tải chi tiết phỏng vấn:', err)
        setError('Không thể tải thông tin phỏng vấn')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchInterview()
    }
  }, [token, user, navigate, id])

  const handleStartInterview = async () => {
    try {
      setStarting(true)
      const response = await axiosClient.post(`/interviews/${id}/start`)
      const sessionId = response.data.id
      navigate(`/interview/${id}/test/${sessionId}`)
    } catch (err) {
      console.error('Lỗi khi bắt đầu phỏng vấn:', err)
      setError('Không thể bắt đầu phỏng vấn')
    } finally {
      setStarting(false)
    }
  }

  if (!token || !user) {
    return null
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    )
  }

  if (error || !interview) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => navigate('/interview')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Quay lại
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const difficultyColors = {
    EASY: 'bg-green-100 text-green-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HARD: 'bg-red-100 text-red-700'
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-3 md:px-6 py-6 md:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/interview')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại phòng phỏng vấn
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl">
              <Briefcase className="w-12 h-12 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{interview.title}</h1>
              <div className="flex gap-2 flex-wrap">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  {interview.role}
                </span>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                  {interview.field}
                </span>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${difficultyColors[interview.difficulty as keyof typeof difficultyColors]}`}>
                  {interview.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin phỏng vấn</h2>
          <p className="text-gray-700 leading-relaxed">{interview.description}</p>
        </div>

        {/* Interview Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-800">Thời gian</h3>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{interview.durationMinutes} phút</p>
            <p className="text-sm text-gray-600 mt-1">Tổng thời gian làm bài</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-800">Số câu hỏi</h3>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{interview.totalQuestions}</p>
            <p className="text-sm text-gray-600 mt-1">Các câu hỏi kỹ thuật & thực hành</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-800">Điểm vượt qua</h3>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{interview.passingScore}%</p>
            <p className="text-sm text-gray-600 mt-1">Điểm tối thiểu để đạt</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">⭐</span>
              <h3 className="font-semibold text-gray-800">XP Thưởng</h3>
            </div>
            <p className="text-2xl font-bold text-indigo-600">+{interview.xpReward}</p>
            <p className="text-sm text-gray-600 mt-1">Khi hoàn thành</p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">⚠️ Lưu ý trước khi bắt đầu</h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• Hãy chuẩn bị một môi trường yên tĩnh để tập trung</li>
            <li>• Bạn sẽ không thể thoát giữa cuộc phỏng vấn</li>
            <li>• Hãy trả lời tất cả các câu hỏi một cách chi tiết</li>
            <li>• Thời gian có hạn, hãy quản lý thời gian một cách khôn ngoan</li>
          </ul>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartInterview}
          disabled={starting}
          className="w-full px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {starting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Đang bắt đầu...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Bắt đầu phỏng vấn
            </>
          )}
        </button>
      </div>
    </Layout>
  )
}
