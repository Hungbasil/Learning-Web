import { useState, useMemo } from 'react'
import {
  Code,
  Play,
  Zap,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  ChevronDown,
  Copy,
  RefreshCw,
} from 'lucide-react'
import { axiosClient } from '@/config/axiosClient'

interface TestCase {
  id: number
  inputData: string
  expectedOutput: string
  isHidden: boolean
}

interface CodeChallenge {
  id: number
  title: string
  description: string
  difficulty: string
  xpReward: number
  testCases: TestCase[]
  totalTestCases: number
}

interface CodeChallengeTestProps {
  challenge: CodeChallenge
  lessonId: number
}

export function CodeChallengeTest({ challenge, lessonId }: CodeChallengeTestProps) {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    type: 'EVALUATION' | 'AI_ANALYSIS'
    status?: 'ACCEPTED' | 'WRONG_ANSWER'
    xpEarned?: number
    feedback?: string
  } | null>(null)
  const [expandedTestCase, setExpandedTestCase] = useState<number | null>(0)
  const [aiTokens, setAiTokens] = useState(5) // Mock value

  // Language options
  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
  ]

  // Visible test cases
  const visibleTestCases = useMemo(
    () => challenge.testCases.filter((tc) => !tc.isHidden),
    [challenge.testCases]
  )

  const handleSubmitCode = async () => {
    if (!code.trim()) {
      alert('Vui lòng nhập mã code')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axiosClient.post(
        `/challenges/${challenge.id}/process`,
        {
          language,
          submittedCode: code,
          isAiAnalysis: false,
        }
      )
      setResult(response.data)
    } catch (err) {
      console.error('Error submitting code:', err)
      alert('Lỗi khi nộp bài')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAiAnalysis = async () => {
    if (!code.trim()) {
      alert('Vui lòng nhập mã code')
      return
    }

    if (aiTokens <= 0) {
      alert('Bạn không đủ AI tokens. Vui lòng nâng cấp tài khoản.')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await axiosClient.post(
        `/challenges/${challenge.id}/process`,
        {
          language,
          submittedCode: code,
          isAiAnalysis: true,
        }
      )
      setResult(response.data)
      setAiTokens(response.data.remainingTokens || aiTokens - 1)
    } catch (err) {
      console.error('Error analyzing code:', err)
      alert('Lỗi khi phân tích bằng AI')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setCode('')
    setResult(null)
    setExpandedTestCase(0)
  }

  const handleCopyExample = (input: string) => {
    navigator.clipboard.writeText(input)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT SIDE - Description & Details */}
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-2xl font-bold text-gray-900">{challenge.title}</h2>
            <span className={`px-3 py-1 text-xs font-semibold rounded ${
              challenge.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
              challenge.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {challenge.difficulty === 'EASY' ? 'DỄ' :
               challenge.difficulty === 'MEDIUM' ? 'TRUNG BÌNH' : 'KHÓ'}
            </span>
          </div>

          {/* Info Box */}
          <div className="bg-purple-50 border border-purple-200 rounded p-4 mb-4">
            <p className="text-sm text-purple-900">
              <span className="font-semibold">💡 Đang bị tương?</span>
              <br />
              Nhân nút "Phân tích AI" để nhận gợi ý thích chi tiết cách giải bài. Tính năng copy là tắt đặc bản để bạn tự học tốt hơn!
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 text-xs mb-1">Độ khó</p>
              <p className="font-bold text-gray-900">
                {challenge.difficulty === 'EASY' ? 'Dễ' :
                 challenge.difficulty === 'MEDIUM' ? 'Trung bình' : 'Khó'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-xs mb-1 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Thưởng
              </p>
              <p className="font-bold text-yellow-600">{challenge.xpReward} XP</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">Mô tả bài toán</h3>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {challenge.description}
          </p>
        </div>

        {/* Test Cases */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">
            Test Cases Mẫu ({visibleTestCases.length} / {challenge.totalTestCases})
          </h3>
          <p className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <span className="font-semibold">ℹ️ Lưu ý:</span> Bạn có thể thấy {visibleTestCases.length} test case(s) mẫu. Code của bạn sẽ được đánh giá với {challenge.totalTestCases - visibleTestCases.length} test case(s) ẩn
          </p>

          <div className="space-y-2">
            {visibleTestCases.map((testCase, idx) => (
              <div
                key={testCase.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedTestCase(expandedTestCase === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition text-left"
                >
                  <span className="font-semibold text-gray-900">Test Case {idx + 1}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      expandedTestCase === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedTestCase === idx && (
                  <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-3">
                    {/* Input */}
                    <div>
                      <p className="text-xs font-bold text-gray-700 mb-2">Input:</p>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto relative group">
                        <pre>{testCase.inputData}</pre>
                        <button
                          onClick={() => handleCopyExample(testCase.inputData)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1.5 bg-gray-700 hover:bg-gray-600 rounded"
                          title="Copy"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Expected Output */}
                    <div>
                      <p className="text-xs font-bold text-gray-700 mb-2">Expected Output:</p>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                        <pre>{testCase.expectedOutput}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Code Editor & Results */}
      <div className="space-y-4 flex flex-col">
        {/* Language & Actions */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              Ngôn ngữ:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm font-medium bg-white"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm font-semibold rounded transition"
              title="Xóa code"
            >
              <RefreshCw className="w-4 h-4" />
              Chạy lại
            </button>
            <button
              onClick={handleAiAnalysis}
              disabled={isAnalyzing || aiTokens <= 0}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white text-sm font-semibold rounded transition"
              title="Phân tích bằng AI (chi phí 1 token)"
            >
              <Lightbulb className="w-4 h-4" />
              Phân tích AI ({aiTokens})
            </button>
            <button
              onClick={handleSubmitCode}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold rounded transition"
            >
              <Play className="w-4 h-4" />
              {isSubmitting ? 'Đang chạy...' : 'Nộp bài'}
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 bg-white rounded-lg p-4 border border-gray-200 overflow-hidden flex flex-col">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Nhập code của bạn tại đây..."
            className="flex-1 font-mono text-sm p-4 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            spellCheck={false}
          />
          <p className="text-xs text-gray-500 mt-2 text-right">
            {code.length} ký tự
          </p>
        </div>

        {/* Result Display */}
        {result && (
          <div className={`rounded-lg p-6 ${
            result.type === 'EVALUATION'
              ? result.status === 'ACCEPTED'
                ? 'bg-green-50 border-2 border-green-300'
                : 'bg-red-50 border-2 border-red-300'
              : 'bg-blue-50 border-2 border-blue-300'
          }`}>
            {result.type === 'EVALUATION' ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {result.status === 'ACCEPTED' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                  <h3 className={`font-bold text-lg ${
                    result.status === 'ACCEPTED' ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {result.status === 'ACCEPTED' ? 'Chính xác! ✅' : 'Sai rồi ❌'}
                  </h3>
                </div>
                {result.status === 'ACCEPTED' && (
                  <div className="flex items-center gap-2 text-yellow-600 font-semibold">
                    <Zap className="w-5 h-5" />
                    Bạn đã nhận được {result.xpEarned} XP
                  </div>
                )}
                {result.status === 'WRONG_ANSWER' && (
                  <p className="text-red-800">Vui lòng kiểm tra lại code của bạn</p>
                )}
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-lg text-blue-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Gợi ý từ AI
                </h3>
                <div className="text-blue-800 text-sm whitespace-pre-wrap prose prose-sm max-w-none">
                  {result.feedback}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeChallengeTest
