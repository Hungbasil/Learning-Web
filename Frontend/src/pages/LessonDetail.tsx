import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Clock,
  Zap,
  Download,
  FileText,
  Code,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Bookmark,
} from 'lucide-react'
import { Layout } from '@/components/Layout'
import { axiosClient } from '@/config/axiosClient'

// ============ INTERFACES ============
interface LessonMaterial {
  id: number
  title: string
  description: string
  fileUrl: string
  materialType: string
  orderIndex: number
}

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

interface Lesson {
  id: number
  title: string
  duration: number
  orderIndex: number
}

interface Section {
  id: number
  title: string
  lessons: Lesson[]
}

interface LessonDetailResponse {
  id: number
  title: string
  videoUrl: string
  content: string
  duration: number
  isFree: boolean
  orderIndex: number
  materials: LessonMaterial[]
  quiz: QuizInfo | null
  challenges: CodeChallenge[]
  section?: Section
}

// ============ MAIN COMPONENT ============

export function LessonDetail() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'materials' | 'quiz' | 'challenges'>('materials')
  const [expandedSection, setExpandedSection] = useState<number | null>(null)

  const { data: lesson, isLoading, isError } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const response = await axiosClient.get(`/api/lessons/${lessonId}`)
      return response.data as LessonDetailResponse
    },
    enabled: !!lessonId,
  })

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-500">Đang tải bài học...</div>
        </div>
      </Layout>
    )
  }

  if (isError || !lesson) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-500">Không thể tải bài học</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex">
        {/* SIDEBAR - Left */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto hidden lg:block">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Chương trình học</h3>
            {lesson.section && (
              <div className="space-y-2">
                <button
                  onClick={() => setExpandedSection(expandedSection === lesson.section!.id ? null : lesson.section!.id)}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded transition"
                >
                  <span className="text-xs font-semibold text-gray-700">{lesson.section.title}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${expandedSection === lesson.section.id ? 'rotate-180' : ''}`}
                  />
                </button>

                {expandedSection === lesson.section.id && (
                  <div className="ml-2 space-y-1">
                    {lesson.section.lessons.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => navigate(`/courses/${courseId}/lessons/${l.id}`)}
                        className={`w-full text-left p-2 rounded text-xs transition ${
                          l.id === lesson.id
                            ? 'bg-blue-100 text-blue-700 font-semibold'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold w-5 h-5 flex items-center justify-center">
                            {l.orderIndex}
                          </span>
                          <span className="truncate">{l.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 md:p-8 max-w-5xl">
          {/* Header Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Thời lượng</div>
                  <div className="font-semibold text-gray-900">{lesson.duration} phút</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-xs text-gray-500">XP tối đa</div>
                  <div className="font-semibold text-gray-900">
                    {Math.max(
                      lesson.quiz?.xpReward || 0,
                      ...lesson.challenges.map((c) => c.xpReward || 0)
                    )}{' '}
                    XP
                  </div>
                </div>
              </div>

              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition">
                <Bookmark className="w-5 h-5" />
                <span className="text-sm font-medium">Lưu</span>
              </button>

              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition">
                <Download className="w-5 h-5" />
                <span className="text-sm font-medium">Rb</span>
              </button>
            </div>
          </div>

          {/* Status Box */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Trang thái hoàn thành</h3>
                <p className="text-sm text-yellow-800">Vượt qua 4 nhật một bài kiểm tra</p>
              </div>
            </div>
          </div>

          {/* Challenge Info Box */}
          {lesson.challenges.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-400 rounded p-4 mb-6">
              <div className="flex gap-3">
                <Code className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Bài tập hành code</h3>
                  <p className="text-sm text-blue-800">
                    ({lesson.challenges.length} bài - {' '}
                    <span className="font-semibold">
                      {lesson.challenges.reduce((sum, c) => sum + (c.xpReward || 0), 0)} XP
                    </span>
                    )
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Not Passed Warning */}
          {lesson.quiz && (
            <div className="bg-orange-50 border border-orange-200 rounded p-4 mb-6">
              <p className="text-sm text-orange-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Chưa vượt qua bài kiểm tra
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('materials')}
                className={`flex-1 py-3 px-4 font-medium text-sm transition border-b-2 ${
                  activeTab === 'materials'
                    ? 'text-orange-500 border-orange-500'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Tài liệu học tập
                </div>
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 py-3 px-4 font-medium text-sm transition border-b-2 ${
                  activeTab === 'quiz'
                    ? 'text-orange-500 border-orange-500'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Bài kiểm tra
                </div>
              </button>
              <button
                onClick={() => setActiveTab('challenges')}
                className={`flex-1 py-3 px-4 font-medium text-sm transition border-b-2 ${
                  activeTab === 'challenges'
                    ? 'text-orange-500 border-orange-500'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Code className="w-4 h-4" />
                  Thử thách lập trình
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'materials' && (
                <MaterialsTab materials={lesson.materials} lessonContent={lesson.content} />
              )}
              {activeTab === 'quiz' && <QuizTab quiz={lesson.quiz} />}
              {activeTab === 'challenges' && <ChallengesTab challenges={lesson.challenges} />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// ============ TAB COMPONENTS ============

function MaterialsTab({
  materials,
  lessonContent,
}: {
  materials: LessonMaterial[]
  lessonContent: string
}) {
  return (
    <div className="space-y-6">
      {/* Lesson Content */}
      {lessonContent && (
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Nội dung bài học</h3>
          <p className="text-gray-700 leading-relaxed">{lessonContent}</p>
        </div>
      )}

      {/* Materials List */}
      {materials && materials.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-3">Tài liệu cung cấp</h3>
          <div className="space-y-2">
            {materials.map((material) => (
              <div
                key={material.id}
                className="bg-gray-50 p-4 rounded border border-gray-200 hover:bg-gray-100 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {material.materialType === 'PDF' && <FileText className="w-5 h-5 text-red-600" />}
                  {material.materialType === 'CODE' && <Code className="w-5 h-5 text-green-600" />}
                  {material.materialType === 'DOCUMENT' && <FileText className="w-5 h-5 text-yellow-600" />}
                  <div>
                    <p className="font-medium text-gray-900">{material.title}</p>
                    <p className="text-xs text-gray-600">{material.description}</p>
                  </div>
                </div>
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded hover:bg-orange-600 transition flex-shrink-0"
                >
                  Tải
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Chưa có tài liệu học tập
        </div>
      )}
    </div>
  )
}

function QuizTab({ quiz }: { quiz: QuizInfo | null }) {
  if (!quiz) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
        Bài học này chưa có bài kiểm tra
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded border border-blue-200">
        <h3 className="font-bold text-blue-900">{quiz.title}</h3>
        <div className="flex gap-6 text-sm mt-2 text-blue-800">
          <span>Câu hỏi: {quiz.totalQuestions}</span>
          <span>Điểm qua: {quiz.passingScore}%</span>
          <span className="font-semibold">+{quiz.xpReward} XP</span>
        </div>
      </div>

      {quiz.questions.map((q, idx) => (
        <div key={q.id} className="border border-gray-200 rounded p-4">
          <div className="flex gap-3 mb-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {idx + 1}
            </span>
            <p className="font-medium text-gray-900">{q.content}</p>
          </div>
          <div className="ml-9 space-y-2">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                className="w-full text-left p-2 border border-gray-300 rounded hover:bg-blue-50 transition text-sm"
              >
                {opt.optionText}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition font-medium">
        Bắt đầu bài kiểm tra
      </button>
    </div>
  )
}

function ChallengesTab({ challenges }: { challenges: CodeChallenge[] }) {
  if (!challenges || challenges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Code className="w-12 h-12 mx-auto mb-2 opacity-30" />
        Bài học này chưa có thử thách lập trình
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge, idx) => (
        <div key={challenge.id} className="border border-gray-200 rounded p-4">
          <div className="flex items-start gap-3 mb-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {idx + 1}
            </span>
            <div>
              <h4 className="font-bold text-gray-900">{challenge.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 ml-9 mb-3">
            <div className="bg-gray-50 p-2 rounded text-center">
              <div className="text-xs text-gray-600">Độ khó</div>
              <div className="font-semibold text-xs">
                {challenge.difficulty === 'EASY' && <span className="text-green-600">Dễ</span>}
                {challenge.difficulty === 'MEDIUM' && <span className="text-yellow-600">Trung bình</span>}
                {challenge.difficulty === 'HARD' && <span className="text-red-600">Khó</span>}
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded text-center">
              <div className="text-xs text-gray-600">Test cases</div>
              <div className="font-semibold text-xs">{challenge.totalTestCases}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded text-center">
              <div className="text-xs text-gray-600">XP</div>
              <div className="font-semibold text-xs text-yellow-600">{challenge.xpReward}</div>
            </div>
          </div>

          <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition font-medium text-sm">
            Bắt đầu thử thách
          </button>
        </div>
      ))}
    </div>
  )
}

export default LessonDetail

