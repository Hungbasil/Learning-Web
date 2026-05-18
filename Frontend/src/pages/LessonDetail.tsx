import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Clock,
  Zap,
  ThumbsUp,
  Download,
  FileText,
  Code,
  CheckCircle,
  Play,
  Lock,
  ChevronLeft,
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
}

// ============ COMPONENTS ============

export function LessonDetail() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'materials' | 'quiz' | 'challenges'>('materials')

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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header với back button */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
          </div>

          {/* Video Player */}
          {lesson.videoUrl && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <div className="bg-black aspect-video flex items-center justify-center">
                <video
                  src={lesson.videoUrl}
                  controls
                  className="w-full h-full"
                >
                  Trình duyệt của bạn không hỗ trợ video
                </video>
              </div>
            </div>
          )}

          {/* Lesson Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Thời lượng</div>
                  <div className="font-semibold">{lesson.duration} phút</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-sm text-gray-500">XP tối đa</div>
                  <div className="font-semibold">
                    {Math.max(
                      lesson.quiz?.xpReward || 0,
                      ...lesson.challenges.map(c => c.xpReward || 0)
                    )} XP
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-red-500" />
                <div>
                  <div className="text-sm text-gray-500">Lượt thích</div>
                  <div className="font-semibold">124</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-sm text-gray-500">Tải về</div>
                  <div className="font-semibold">3.2K</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('materials')}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  activeTab === 'materials'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Tài liệu học tập
                </div>
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  activeTab === 'quiz'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Bài kiểm tra
                </div>
              </button>
              <button
                onClick={() => setActiveTab('challenges')}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  activeTab === 'challenges'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Code className="w-4 h-4" />
                  Thử thách lập trình
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
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
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Nội dung bài học</h3>
          <div className="prose max-w-none text-gray-700">
            {lessonContent}
          </div>
        </div>
      )}

      {/* Materials List */}
      {materials && materials.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Tài liệu cung cấp</h3>
          <div className="space-y-3">
            {materials.map(material => (
              <div
                key={material.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {material.materialType === 'PDF' && (
                      <FileText className="w-6 h-6 text-red-600" />
                    )}
                    {material.materialType === 'VIDEO' && (
                      <Play className="w-6 h-6 text-blue-600" />
                    )}
                    {material.materialType === 'CODE' && (
                      <Code className="w-6 h-6 text-green-600" />
                    )}
                    {material.materialType === 'DOCUMENT' && (
                      <FileText className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{material.title}</h4>
                    <p className="text-sm text-gray-600">{material.description}</p>
                  </div>
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={e => e.stopPropagation()}
                  >
                    Tải về
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Chưa có tài liệu học tập nào
        </div>
      )}
    </div>
  )
}

function QuizTab({ quiz }: { quiz: QuizInfo | null }) {
  if (!quiz) {
    return (
      <div className="text-center py-12 text-gray-500">
        <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p>Bài học này chưa có bài kiểm tra</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-gray-600">Số câu hỏi: </span>
            <span className="font-semibold">{quiz.totalQuestions}</span>
          </div>
          <div>
            <span className="text-gray-600">Điểm qua: </span>
            <span className="font-semibold">{quiz.passingScore}%</span>
          </div>
          <div>
            <span className="text-gray-600">Thưởng XP: </span>
            <span className="font-semibold text-yellow-600">{quiz.xpReward} XP</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium mb-3">{question.content}</p>
                <div className="space-y-2">
                  {question.options.map(option => (
                    <div
                      key={option.id}
                      className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                    >
                      {option.optionText}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded">
                {question.difficulty}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
                +{question.xpReward} XP
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
        Bắt đầu bài kiểm tra
      </button>
    </div>
  )
}

function ChallengesTab({ challenges }: { challenges: CodeChallenge[] }) {
  if (!challenges || challenges.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Code className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p>Bài học này chưa có thử thách lập trình</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {challenges.map((challenge, index) => (
        <div key={challenge.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
              <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
            </div>
            <p className="text-gray-600">{challenge.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-3 rounded border border-gray-300">
              <div className="text-sm text-gray-600">Độ khó</div>
              <div className="font-semibold">
                {challenge.difficulty === 'EASY' && (
                  <span className="text-green-600">Dễ</span>
                )}
                {challenge.difficulty === 'MEDIUM' && (
                  <span className="text-yellow-600">Trung bình</span>
                )}
                {challenge.difficulty === 'HARD' && (
                  <span className="text-red-600">Khó</span>
                )}
              </div>
            </div>
            <div className="bg-white p-3 rounded border border-gray-300">
              <div className="text-sm text-gray-600">Test cases</div>
              <div className="font-semibold">{challenge.totalTestCases}</div>
            </div>
            <div className="bg-white p-3 rounded border border-gray-300">
              <div className="text-sm text-gray-600">Thưởng XP</div>
              <div className="font-semibold text-yellow-600">{challenge.xpReward} XP</div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Test cases mẫu:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {challenge.testCases.map((tc, idx) => (
                !tc.isHidden && (
                  <div key={tc.id} className="bg-white p-3 rounded border border-gray-300 text-xs font-mono">
                    <div className="mb-1">
                      <span className="text-gray-600">Input {idx + 1}:</span>
                      <div className="text-gray-900">{tc.inputData}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Output:</span>
                      <div className="text-green-700">{tc.expectedOutput}</div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold">
            <Play className="w-4 h-4 inline mr-2" />
            Bắt đầu thử thách
          </button>
        </div>
      ))}
    </div>
  )
}

export default LessonDetail
