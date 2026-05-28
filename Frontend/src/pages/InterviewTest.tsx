import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { ArrowLeft, Send, ChevronRight } from 'lucide-react'
import axiosClient from '@/config/axiosClient'

interface Question {
  id: number
  content: string
  questionType: string
  difficulty: string
  timeLimitMinutes: number
  orderIndex: number
}

interface Interview {
  id: number
  title: string
  totalQuestions: number
}

export default function InterviewTest() {
  const { token, user } = useAuthStore()
  const navigate = useNavigate()
  const { id, sessionId } = useParams<{ id: string; sessionId: string }>()
  
  const [interview, setInterview] = useState<Interview | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const interviewRes = await axiosClient.get(`/api/interviews/${id}`)
        setInterview(interviewRes.data)
        setQuestions(interviewRes.data.questions || [])
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err)
        setError('Không thể tải câu hỏi')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [token, user, navigate, id])

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (currentQuestion) {
      setAnswers({
        ...answers,
        [currentQuestion.id]: value
      })
    }
  }

  const handleSaveAndNext = async () => {
    if (!currentQuestion || !sessionId) return

    try {
      await axiosClient.post(`/api/interviews/sessions/${sessionId}/answers`, {
        questionId: currentQuestion.id,
        answerText: answers[currentQuestion.id] || ''
      })

      if (!isLastQuestion) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }
    } catch (err) {
      console.error('Lỗi khi lưu câu trả lời:', err)
    }
  }

  const handleSubmit = async () => {
    if (!sessionId) return

    try {
      setSubmitting(true)
      // Save last answer
      if (currentQuestion && answers[currentQuestion.id] !== undefined) {
        await axiosClient.post(`/api/interviews/sessions/${sessionId}/answers`, {
          questionId: currentQuestion.id,
          answerText: answers[currentQuestion.id] || ''
        })
      }

      // Submit session
      const response = await axiosClient.put(`/api/interviews/sessions/${sessionId}/submit`)
      navigate(`/interview/${id}/result/${sessionId}`)
    } catch (err) {
      console.error('Lỗi khi nộp bài:', err)
      setError('Không thể nộp bài phỏng vấn')
    } finally {
      setSubmitting(false)
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

  if (error || !currentQuestion) {
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

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'TECHNICAL': 'Kỹ thuật',
      'CODE': 'Viết mã',
      'TEXT': 'Văn bản'
    }
    return labels[type] || type
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'EASY': 'bg-green-100 text-green-700',
      'MEDIUM': 'bg-yellow-100 text-yellow-700',
      'HARD': 'bg-red-100 text-red-700'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-700'
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-3 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(`/interview/${id}`)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Thoát
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-600">Câu hỏi {currentQuestionIndex + 1}/{questions.length}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-8">
          {/* Question Info */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty}
            </span>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {getQuestionTypeLabel(currentQuestion.questionType)}
            </span>
            {currentQuestion.timeLimitMinutes && (
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                ⏱️ {currentQuestion.timeLimitMinutes} phút
              </span>
            )}
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-gray-800 mb-8">{currentQuestion.content}</h2>

          {/* Answer Area */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Câu trả lời của bạn</label>
            <textarea
              value={answers[currentQuestion.id] || ''}
              onChange={handleAnswerChange}
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Nhập câu trả lời của bạn tại đây..."
            />
            <p className="text-xs text-gray-500 mt-2">
              {(answers[currentQuestion.id] || '').length} / 5000 ký tự
            </p>
          </div>

          {/* Question Sidebar */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 font-semibold mb-2">💡 GỢI Ý:</p>
            <p className="text-sm text-gray-700">
              {currentQuestion.questionType === 'CODE'
                ? 'Viết mã sạch, dễ đọc và giải thích logic của bạn'
                : 'Hãy trả lời chi tiết, tỏ ra bạn hiểu rõ về chủ đề'}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Câu trước
            </button>

            <button
              onClick={isLastQuestion ? handleSubmit : handleSaveAndNext}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang xử lý...
                </>
              ) : isLastQuestion ? (
                <>
                  <Send className="w-4 h-4" />
                  Nộp bài
                </>
              ) : (
                <>
                  Câu tiếp theo
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Questions Overview */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Tổng quan câu hỏi</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`aspect-square flex items-center justify-center rounded-lg font-semibold text-sm transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                    : answers[q.id]
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
