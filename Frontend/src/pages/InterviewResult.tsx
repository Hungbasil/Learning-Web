import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { ArrowLeft, Lock, Check, AlertCircle, TrendingUp } from 'lucide-react'
import axiosClient from '@/config/axiosClient'

interface Answer {
  id: number
  userAnswer: string
  score: number | null
  feedback: string
  question: {
    id: number
    content: string
    questionType: string
  }
}

interface Result {
  sessionId: number
  interviewId: number
  interviewTitle: string
  totalScore: number
  passingScore: number
  status: string
  startTime: string
  endTime: string
  answers: Answer[]
}

export default function InterviewResult() {
  const { token, user } = useAuthStore()
  const navigate = useNavigate()
  const { id, sessionId } = useParams<{ id: string; sessionId: string }>()
  
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedAnswer, setExpandedAnswer] = useState<number | null>(null)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
      return
    }

    // Check if user is premium
    setIsPremium(user.isPremium === true)

    const fetchResult = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get(`/interviews/sessions/${sessionId}/result`)
        setResult(response.data)
      } catch (err) {
        console.error('Lỗi khi tải kết quả:', err)
        setError('Không thể tải kết quả phỏng vấn')
      } finally {
        setLoading(false)
      }
    }

    if (sessionId) {
      fetchResult()
    }
  }, [token, user, navigate, sessionId])

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

  if (error || !result) {
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

  const isPassed = result.totalScore >= result.passingScore
  const scorePercentage = Math.round((result.totalScore / (result.answers.length * 10)) * 100)

  const strengths = [
    'Câu trả lời chi tiết và có cấu trúc tốt',
    'Hiểu rõ các khái niệm cơ bản',
    'Cách tiếp cận vấn đề logic'
  ]

  const improvements = [
    'Cần làm quen thêm với các best practices',
    'Hãy cung cấp thêm ví dụ cụ thể',
    'Tập trung vào performance optimization'
  ]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-3 md:px-6 py-6 md:py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/interview')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại phòng phỏng vấn
        </button>

        {/* Result Status */}
        <div className="mb-8">
          <div className="text-center">
            {isPassed ? (
              <div className="mb-4 inline-block">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="4"
                      strokeDasharray={`${(scorePercentage / 100) * 2 * Math.PI * 60} ${2 * Math.PI * 60}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <p className="text-4xl font-bold text-gray-800">{scorePercentage}%</p>
                      <p className="text-sm text-gray-600">Đã vượt qua</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4 inline-block">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="4"
                      strokeDasharray={`${(scorePercentage / 100) * 2 * Math.PI * 60} ${2 * Math.PI * 60}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <p className="text-4xl font-bold text-gray-800">{scorePercentage}%</p>
                      <p className="text-sm text-gray-600">Chưa vượt qua</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-800 mt-8 mb-2">
              {isPassed ? '🎉 Chúc mừng!' : '⏳ Kết quả'}
            </h1>
            <p className="text-gray-600 text-lg mb-4">{result.interviewTitle}</p>
            <div className="text-2xl font-bold text-indigo-600">
              {result.totalScore} / {result.answers.length * 10}
            </div>
          </div>
        </div>

        {/* Score Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Điểm của bạn</p>
            <p className="text-3xl font-bold text-indigo-600">{result.totalScore}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Điểm yêu cầu</p>
            <p className="text-3xl font-bold text-gray-800">{result.passingScore}%</p>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <Check className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-green-900">Điểm mạnh</h3>
            </div>
            <ul className="space-y-2">
              {strengths.map((strength, idx) => (
                <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-bold text-yellow-900">Cần cải thiện</h3>
            </div>
            <ul className="space-y-2">
              {improvements.map((improvement, idx) => (
                <li key={idx} className="text-sm text-yellow-800 flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed Feedback */}
        {isPremium && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📝 Phản hồi chi tiết từng câu hỏi</h3>
            <div className="space-y-4">
              {result.answers.map((answer) => (
                <div
                  key={answer.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all"
                >
                  <button
                    onClick={() => setExpandedAnswer(expandedAnswer === answer.id ? null : answer.id)}
                    className="w-full text-left flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-600">Câu {answer.id}</span>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          {answer.question.questionType === 'TECHNICAL' ? 'Kỹ thuật' : 'Code'}
                        </span>
                        {answer.score !== null && (
                          <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                            {answer.score}/10
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{answer.question.content}</p>
                    </div>
                    <div className="text-gray-400">
                      {expandedAnswer === answer.id ? '▼' : '▶'}
                    </div>
                  </button>

                  {expandedAnswer === answer.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Câu trả lời của bạn:</p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded line-clamp-3">
                          {answer.userAnswer || '(Không có câu trả lời)'}
                        </p>
                      </div>

                      {answer.feedback && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">💡 Phản hồi AI:</p>
                          <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded border border-blue-200">
                            {answer.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Lock */}
        {!isPremium && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 mb-8">
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-purple-900 mb-2">🔒 Phản hồi chi tiết - Tính năng Premium</h3>
                <p className="text-sm text-purple-800 mb-4">
                  Để xem phân tích chi tiết từng câu hỏi và nhận được những đề xuất cải thiện cụ thể, vui lòng nâng cấp lên gói Premium.
                </p>
                <button className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                  Nâng cấp lên Premium
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/interview')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Quay lại
          </button>
          {isPassed && (
            <button
              onClick={() => navigate('/interview')}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Tiếp tục luyện tập
            </button>
          )}
        </div>
      </div>
    </Layout>
  )
}
