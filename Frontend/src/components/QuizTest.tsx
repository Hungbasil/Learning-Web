import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Zap,
  RotateCcw,
} from 'lucide-react'
import { axiosClient } from '@/config/axiosClient'

interface QuizOption {
  id: number
  optionText: string
}

interface QuizQuestion {
  id: number
  content: string
  difficulty: string
  xpReward: number
  options: QuizOption[]
}

interface QuizInfo {
  id: number
  title: string
  passingScore: number
  xpReward: number
  questions: QuizQuestion[]
  totalQuestions: number
}

interface QuizTestProps {
  quiz: QuizInfo
  lessonId: number
  onQuizPass?: () => void
}

export function QuizTest({ quiz, lessonId, onQuizPass }: QuizTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number | null }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{
    score: number
    isPassed: boolean
    earnedXp: number
    alreadyPassed?: boolean
  } | null>(null)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const answeredCount = Object.values(answers).filter((a) => a !== null).length

  const handleSelectAnswer = (optionId: number) => {
    if (!submitted) {
      setAnswers({
        ...answers,
        [currentQuestion.id]: optionId,
      })
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Chuyển đổi answers object thành format mà backend yêu cầu
      const formattedAnswers: { [key: number]: number } = {}
      Object.entries(answers).forEach(([questionId, optionId]) => {
        if (optionId !== null) {
          formattedAnswers[parseInt(questionId)] = optionId
        }
      })

      const response = await axiosClient.post(`/quizzes/${quiz.id}/submit`, {
        answers: formattedAnswers,
      })

      setResult({
        score: response.data.score,
        isPassed: response.data.isPassed,
        earnedXp: response.data.earnedXp,
        alreadyPassed: response.data.alreadyPassed || false, // Detect nếu đã pass rồi
      })
      setSubmitted(true)
      
      // ✅ FIX: Gọi callback nếu quiz pass (dù lần 1 hay lần 2+) để sidebar luôn update
      if (response.data.isPassed && onQuizPass) {
        setTimeout(() => {
          onQuizPass()
        }, 2000) // Delay 2 giây để người dùng thấy kết quả
      }
    } catch (err) {
      console.error('Error submitting quiz:', err)
      alert('Lỗi khi nộp bài kiểm tra')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setSubmitted(false)
    setResult(null)
  }

  // Hiển thị kết quả
  if (submitted && result) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Result Card */}
        <div className={`rounded-lg p-8 text-center mb-6 ${
          result.isPassed ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
        }`}>
          {result.isPassed ? (
            <div>
              <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                {result.alreadyPassed ? 'Bạn đã hoàn thành! ✅' : 'Chúc mừng! 🎉'}
              </h2>
              <p className="text-green-800 mb-4">
                {result.alreadyPassed 
                  ? 'Bạn đã vượt qua bài kiểm tra này rồi. Không cộng thêm XP.'
                  : 'Bạn đã vượt qua bài kiểm tra'}
              </p>
            </div>
          ) : (
            <div>
              <AlertCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
              <h2 className="text-2xl font-bold text-red-900 mb-2">Bài kiểm tra không đạt</h2>
              <p className="text-red-800 mb-4">Vui lòng cố gắng lại</p>
            </div>
          )}

          {/* Score */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded p-4">
              <p className="text-gray-600 text-sm mb-1">Điểm</p>
              <p className="text-3xl font-bold text-gray-900">{result.score}%</p>
            </div>
            <div className="bg-white rounded p-4">
              <p className="text-gray-600 text-sm mb-1">Điểm đạt</p>
              <p className="text-3xl font-bold text-gray-900">{quiz.passingScore}%</p>
            </div>
            <div className="bg-white rounded p-4">
              <p className="text-gray-600 text-sm mb-1 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4" /> XP
              </p>
              <p className={`text-3xl font-bold ${result.alreadyPassed ? 'text-gray-400' : 'text-yellow-600'}`}>
                {result.earnedXp}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
          >
            <RotateCcw className="w-5 h-5" />
            Làm lại
          </button>
          <button 
            onClick={result.isPassed ? onQuizPass : undefined}
            disabled={!result.isPassed}
            className={`px-6 py-3 font-semibold rounded-lg transition ${
              result.isPassed 
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-900 cursor-pointer' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
            }`}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-900">{quiz.title}</h2>
          <span className="text-sm font-semibold text-blue-700">
            {currentQuestionIndex + 1}/{quiz.totalQuestions}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quiz.totalQuestions) * 100}%` }}
          ></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
          <div>
            <p className="text-blue-700 text-xs mb-1">Câu hỏi đã trả lời</p>
            <p className="text-lg font-bold text-blue-900">{answeredCount}/{quiz.totalQuestions}</p>
          </div>
          <div>
            <p className="text-blue-700 text-xs mb-1">Điểm đạt</p>
            <p className="text-lg font-bold text-blue-900">{quiz.passingScore}%</p>
          </div>
          <div>
            <p className="text-blue-700 text-xs mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3" /> XP tối đa
            </p>
            <p className="text-lg font-bold text-yellow-600">{quiz.xpReward}</p>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        {/* Question */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{`Câu ${currentQuestionIndex + 1} / ${quiz.totalQuestions}`}</h3>
          <p className="text-xl text-gray-800 font-semibold mb-4">{currentQuestion.content}</p>

          {/* Difficulty Badge */}
          <div className="inline-block">
            <span className={`px-3 py-1 text-xs font-semibold rounded ${
              currentQuestion.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
              currentQuestion.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentQuestion.difficulty === 'EASY' ? '10 điểm' :
               currentQuestion.difficulty === 'MEDIUM' ? '20 điểm' :
               '30 điểm'}
            </span>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = answers[currentQuestion.id] === option.id
            const letters = ['A', 'B', 'C', 'D', 'E', 'F']

            return (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                disabled={submitted}
                className={`w-full text-left p-4 rounded-lg border-2 transition font-medium flex items-center gap-3 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50 text-gray-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                } ${submitted ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                  isSelected
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {letters[idx]}
                </div>
                <span>{option.optionText}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg transition"
        >
          <ChevronLeft className="w-5 h-5" />
          Trước
        </button>

        {/* Question Navigation */}
        <div className="flex gap-2 flex-wrap justify-center">
          {quiz.questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-8 h-8 rounded font-semibold text-xs transition ${
                idx === currentQuestionIndex
                  ? 'bg-orange-500 text-white'
                  : answers[quiz.questions[idx].id] !== null && answers[quiz.questions[idx].id] !== undefined
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || answeredCount === 0}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
          >
            {isSubmitting ? 'Đang gửi...' : 'Nộp bài'}
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
          >
            Tiếp
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default QuizTest
