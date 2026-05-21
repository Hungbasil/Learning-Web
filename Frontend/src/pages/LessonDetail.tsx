import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
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
import { QuizTest } from '@/components/QuizTest'
import { CodeChallengeTest } from '@/components/CodeChallengeTest'
import { axiosClient } from '@/config/axiosClient'
import { useAuthStore } from '@/store/authStore'

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
  quizPassed?: boolean  // true nếu user đã pass quiz
  challenges: CodeChallenge[]
  section?: Section
}

// ============ MAIN COMPONENT ============

export function LessonDetail() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { token, _hydrated } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'materials' | 'quiz' | 'challenges' | 'comments'>('materials')
  const [expandedSection, setExpandedSection] = useState<number | null>(null)

  const { data: lesson, isLoading, isError, error } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/lessons/${lessonId}`)
        return response.data as LessonDetailResponse
      } catch (err: any) {
        console.error('Error fetching lesson:', err)
        // Nếu 401 Unauthorized, throw error để xử lý
        if (err.response?.status === 401) {
          throw new Error('Unauthorized')
        }
        throw err
      }
    },
    enabled: !!lessonId && !!token && !!_hydrated,
    retry: 1,
  })

  // Fetch course sections để hiện sidebar
  const { data: courseSections = [] } = useQuery<Section[]>({
    queryKey: ['courseSections', courseId],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/courses/${courseId}`)
        return response.data.sections || []
      } catch (err) {
        console.error('Error fetching course sections:', err)
        return []
      }
    },
    enabled: !!courseId && !!token && !!_hydrated,
  })

  // Fetch course info
  const { data: courseInfo } = useQuery({
    queryKey: ['courseInfo', courseId],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/courses/${courseId}`)
        return response.data as any
      } catch (err) {
        console.error('Error fetching course info:', err)
        return null
      }
    },
    enabled: !!courseId && !!token && !!_hydrated,
  })

  // Tính toán total lessons từ sections
  const totalLessons = useMemo(() => {
    return courseSections.reduce((sum, section) => sum + (section.lessons?.length || 0), 0)
  }, [courseSections])

  // Tính toán completion percentage từ lesson.status
  const { completedLessons, completionPercentage } = useMemo(() => {
    const allLessons = courseSections.flatMap(s => s.lessons || [])
    const completed = allLessons.filter((l: any) => l.status === 'completed').length
    const total = allLessons.length || 1
    return {
      completedLessons: completed,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }, [courseSections])

  // Fetch comments
  const { data: comments = [] } = useQuery({
    queryKey: ['lessonComments', lessonId],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/lessons/${lessonId}/comments`)
        return response.data || []
      } catch (err) {
        console.error('Error fetching comments:', err)
        return []
      }
    },
    enabled: !!lessonId && !!token && !!_hydrated,
  })

  // Nếu chưa hydrate xong, show loading
  if (!_hydrated) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </Layout>
    )
  }

  // Nếu không có token, redirect về login
  if (!token) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bạn cần đăng nhập</h2>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Đi tới đăng nhập
            </button>
          </div>
        </div>
      </Layout>
    )
  }

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
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-500 mb-4">Lỗi tải bài học</h2>
            <p className="text-gray-600 mb-4">
              {error?.message === 'Unauthorized' 
                ? 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                : error?.message || 'Không thể tải bài học'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(`/courses/${courseId}`)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Quay lại khóa học
              </button>
              {error?.message === 'Unauthorized' && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  Đăng nhập lại
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex">
        {/* SIDEBAR - Left */}
        <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto hidden lg:block">
          {/* Course Title & Progress - Sticky Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex-shrink-0"></div>
              <h2 className="text-sm font-bold text-gray-900 line-clamp-2">
                {courseInfo?.title || 'Đang tải...'}
              </h2>
            </div>
            
            {/* Overall Progress */}
            <div className="bg-gray-50 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600">
                  {completedLessons}/{totalLessons} bài học
                </p>
                <span className="text-xs font-bold text-orange-500">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Sections List */}
          <div className="p-3">
            {courseSections.length > 0 ? (
              <div className="space-y-1">
                {courseSections.map((section, idx) => {
                  const totalLessonsInSection = section.lessons?.length || 0
                  const completedInSection = section.lessons?.filter((l: any) => l.status === 'completed').length || 0
                  const isExpanded = expandedSection === section.id
                  
                  return (
                    <div key={section.id}>
                      {/* Section Header */}
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded transition text-left group"
                      >
                        <div className="flex-1 min-w-0">
                        
                          <p className="text-sm font-medium text-gray-900 group-hover:text-gray-900">
                              {section.title}
                          </p>
                          
                          <p className="text-xs text-gray-500 mt-1">
                            {completedInSection}/{totalLessonsInSection}
                          </p>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`flex-shrink-0 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Lessons List - Expandable */}
                      {isExpanded && section.lessons && section.lessons.length > 0 && (
                        <div className="ml-3 my-1 space-y-0.5 bg-gray-50 rounded py-2 px-2">
                          {section.lessons.map((lessonItem: any, lessonIdx: number) => (
                            <button
                              key={lessonItem.id}
                              onClick={() => navigate(`/courses/${courseId}/lessons/${lessonItem.id}`)}
                              className={`w-full text-left px-3 py-2 rounded text-xs transition flex items-center gap-2 ${
                                lessonItem.id === parseInt(lessonId || '0')
                                  ? 'bg-blue-100 text-blue-700 font-medium'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <span className="flex-shrink-0">
                                {lessonItem.status === 'completed' ? '✓' : '○'}
                              </span>
                              <span className="truncate">{lessonIdx + 1}. {lessonItem.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500 text-center py-8">Chưa có chương trình học</p>
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
          <div className={`border-l-4 rounded p-4 mb-6 ${
            lesson.quizPassed 
              ? 'bg-green-50 border-green-400' 
              : 'bg-yellow-50 border-yellow-400'
          }`}>
            <div className="flex gap-3">
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                lesson.quizPassed 
                  ? 'text-green-600' 
                  : 'text-yellow-600'
              }`} />
              <div>
                <h3 className={`font-semibold mb-1 ${
                  lesson.quizPassed 
                    ? 'text-green-900' 
                    : 'text-yellow-900'
                }`}>
                  Trạng thái hoàn thành
                </h3>
                <p className={`text-sm ${
                  lesson.quizPassed 
                    ? 'text-green-800' 
                    : 'text-yellow-800'
                }`}>
                  {lesson.quizPassed 
                    ? 'Bạn đã vượt qua bài kiểm tra' 
                    : 'Vượt qua ít nhất 1 bài kiểm tra'}
                </p>
              </div>
            </div>
          </div>

          {/* Challenge Info Box */}
          {lesson.challenges.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-400 rounded p-4 mb-6">
              <div className="flex gap-3">
                <Code className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Bài tập code</h3>
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
          {lesson.quiz && !lesson.quizPassed && (
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
                className={`flex-1 py-3 px-4 font-medium text-sm transition border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === 'materials'
                    ? 'text-orange-500 border-orange-500'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                Tài liệu học tập
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 py-3 px-4 font-medium text-sm transition border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === 'quiz'
                    ? 'text-orange-500 border-orange-500'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Bài kiểm tra
              </button>
              <button
                onClick={() => setActiveTab('challenges')}
                className={`flex-1 py-3 px-4 font-medium text-sm transition border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === 'challenges'
                    ? 'text-orange-500 border-orange-500'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                <Code className="w-4 h-4" />
                Thử thách Code
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`flex-1 py-3 px-4 font-medium text-sm transition border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === 'comments'
                    ? 'text-orange-500 border-orange-500'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Thảo luận
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'materials' && (
                <MaterialsTab materials={lesson.materials} lessonContent={lesson.content} />
              )}
              {activeTab === 'quiz' && <QuizTab quiz={lesson.quiz} lessonId={lessonId || '0'} courseId={courseId || '0'} />}
              {activeTab === 'challenges' && <ChallengesTab challenges={lesson.challenges} lessonId={parseInt(lessonId || '0')} courseId={courseId || '0'} />}
              {activeTab === 'comments' && <CommentsTab lessonId={parseInt(lessonId || '0')} comments={comments} />}
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

function QuizTab({ quiz, lessonId: lessonIdStr, courseId: courseIdStr }: { quiz: QuizInfo | null; lessonId: string; courseId: string }) {
  const [started, setStarted] = useState(false)
  const queryClient = useQueryClient()

  const handleQuizPass = () => {
    // ✅ FIX: Invalidate cả lesson và courseSections queries để sidebar cập nhật tiến độ
    queryClient.invalidateQueries({ queryKey: ['lesson', lessonIdStr] })
    queryClient.invalidateQueries({ queryKey: ['courseSections', courseIdStr] })
    setStarted(false)
  }

  if (!quiz) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
        Bài học này chưa có bài kiểm tra
      </div>
    )
  }

  if (started) {
    return <QuizTest quiz={quiz} lessonId={parseInt(lessonIdStr)} onQuizPass={handleQuizPass} />
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
          <AlertCircle size={18} />
          Yêu cầu hoàn thành bài học
        </h3>
        <p className="text-sm text-blue-800">Bạn chỉ cần vượt qua ít nhất một bài kiểm tra trong bài học này để đáp ứng yêu cầu kiểm tra cho việc hoàn thành bài học.</p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Bài kiểm tra</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-gray-900 flex-1">{quiz.title}</h4>
              <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">Kiểm Tra</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">Bài kiểm tra này kiểm tra kiến thức cơ bản về bài học này.</p>

            <div className="space-y-2 mb-4 text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <AlertCircle size={14} />
                <span>{quiz.totalQuestions} câu hỏi</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={14} />
                <span>Điểm đạt: {quiz.passingScore}%</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-600">
                <Zap size={14} />
                <span>{quiz.xpReward} XP</span>
              </div>
            </div>

            <button
              onClick={() => setStarted(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Bắt đầu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
function ChallengesTab({ challenges, lessonId, courseId }: { challenges: CodeChallenge[]; lessonId: number; courseId: string }) {
  const [selectedChallenge, setSelectedChallenge] = useState<CodeChallenge | null>(
    challenges.length > 0 ? challenges[0] : null
  )
  const queryClient = useQueryClient()

  const handleChallengePass = () => {
    queryClient.invalidateQueries({ queryKey: ['lesson', lessonId.toString()] })
    queryClient.invalidateQueries({ queryKey: ['courseSections', courseId] })
    setSelectedChallenge(null)
  }

  if (!challenges || challenges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Code className="w-12 h-12 mx-auto mb-2 opacity-30" />
        Bài học này chưa có thử thách code
      </div>
    )
  }

  if (selectedChallenge) {
    return (
      <div>
        <button
          onClick={() => setSelectedChallenge(null)}
          className="flex items-center gap-2 px-4 py-2 mb-4 text-orange-600 hover:text-orange-700 font-semibold"
        >
          <ChevronDown className="w-5 h-5 rotate-90" />
          Quay lại danh sách
        </button>
        <CodeChallengeTest challenge={selectedChallenge} lessonId={lessonId} onChallengePass={handleChallengePass} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
          <AlertCircle size={18} />
          Yêu cầu hoàn thành bài học
        </h3>
        <p className="text-sm text-blue-800">Bạn chỉ cần hoàn thành ít nhất một bài thực hành code (đạt trạng thái "Accepted") trong bài học này để đáp ứng yêu cầu thực hành code cho việc hoàn thành bài học.</p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Thử thách lập trình</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-gray-900 flex-1">{challenge.title}</h4>
                <span className={`px-3 py-1 text-xs font-semibold rounded ${
                  challenge.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                  challenge.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {challenge.difficulty === 'EASY' ? 'Dễ' : challenge.difficulty === 'MEDIUM' ? 'Trung bình' : 'Khó'}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{challenge.description}</p>

              <div className="space-y-2 mb-4 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={14} />
                  <span>1 ngôn ngữ</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-600">
                  <Zap size={14} />
                  <span>{challenge.xpReward} XP</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="text-center">
                  <p className="text-gray-600">Đã giải</p>
                  <p className="font-bold text-gray-900">0</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">Tỷ lệ thành công</p>
                  <p className="font-bold text-gray-900">0%</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedChallenge(challenge)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Code size={16} />
                Giải quyết
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CommentsTab({ lessonId, comments }: { lessonId: number, comments: any[] }) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const commentsList = Array.isArray(comments) ? comments : []

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await axiosClient.post(`/lessons/${lessonId}/comments`, {
        content: newComment.trim(),
        parentId: null,
      })
      setNewComment('')
      // Re-fetch comments would be done by React Query here
    } catch (err) {
      console.error('Error adding comment:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* New Comment Form */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-3">Thảo luận & Hỏi đáp</h3>
        <div className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Đặt câu hỏi hoặc chia sẻ ý kiến của bạn..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            rows={4}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">{newComment.length}/2000</span>
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmitting}
              className="px-4 py-2 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">
            {commentsList.length} bình luận
          </h3>
          <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
            Làm mới
          </button>
        </div>

        {commentsList.length > 0 ? (
          <div className="space-y-4">
            {commentsList.map((comment: any) => (
              <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{comment.userName}</p>
                    <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">{comment.content}</p>
                <button className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                  Trả lời
                </button>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 ml-4 pt-3 border-l-2 border-gray-200 space-y-3">
                    {comment.replies.map((reply: any) => (
                      <div key={reply.id}>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{reply.userName}</p>
                          <p className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <p className="text-gray-700 text-sm mt-1">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </div>
        )}
      </div>
    </div>
  )
}

export default LessonDetail

