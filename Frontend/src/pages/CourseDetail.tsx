import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronDown, Lock, CheckCircle, PlayCircle, Star, Clock, BookOpen, Users, Home, Globe, FileText, HelpCircle, Zap } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'

// ============ INTERFACES & TYPES ============
interface Lesson {
  id: string
  title: string
  duration: number // in minutes
  status: 'locked' | 'in-progress' | 'completed'
  order: number
}

interface Chapter {
  id: string
  title: string
  weekNumber: number
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  description: string
  totalHours: number
  totalLessons: number
  enrolledStudents: number
  rating: number
  totalReviews: number
  completionPercentage: number
  chapters: Chapter[]
}

// ============ MOCK DATA ============
const mockCourse: Course = {
  id: '1',
  title: 'Lộ trình JavaScript từ Cơ bản đến Nâng cao',
  description: 'Lộ trình 8 tuần giúp người mới bắt đầu năm vững JavaScript cơ bản, DOM manipulation và các khái niệm lập trình quan trọng.',
  totalHours: 80,
  totalLessons: 56,
  enrolledStudents: 409,
  rating: 5.0,
  totalReviews: 128,
  completionPercentage: 12,
  chapters: [
    {
      id: '1',
      title: 'Làm quen với Python và Cú pháp cơ bản',
      weekNumber: 1,
      lessons: [
        { id: '1-1', title: 'Giới thiệu Python', duration: 15, status: 'completed', order: 1 },
        { id: '1-2', title: 'Cài đặt môi trường', duration: 20, status: 'completed', order: 2 },
        { id: '1-3', title: 'Biến và kiểu dữ liệu', duration: 25, status: 'in-progress', order: 3 },
      ],
    },
    {
      id: '2',
      title: 'Câu lệnh điều kiện và Logic',
      weekNumber: 2,
      lessons: [
        { id: '2-1', title: 'If - Else cơ bản', duration: 18, status: 'locked', order: 1 },
        { id: '2-2', title: 'Toán tử so sánh', duration: 22, status: 'locked', order: 2 },
      ],
    },
    {
      id: '3',
      title: 'Vòng lặp và Xử lý tập hợp',
      weekNumber: 3,
      lessons: [
        { id: '3-1', title: 'For Loop', duration: 20, status: 'locked', order: 1 },
        { id: '3-2', title: 'While Loop', duration: 18, status: 'locked', order: 2 },
        { id: '3-3', title: 'List Comprehension', duration: 25, status: 'locked', order: 3 },
      ],
    },
    {
      id: '4',
      title: 'Danh sách và Dữ liệu tập hợp',
      weekNumber: 4,
      lessons: [
        { id: '4-1', title: 'List & Tuple', duration: 20, status: 'locked', order: 1 },
        { id: '4-2', title: 'Dictionary', duration: 22, status: 'locked', order: 2 },
      ],
    },
    {
      id: '5',
      title: 'Hàm và Tái sử dụng mã',
      weekNumber: 5,
      lessons: [
        { id: '5-1', title: 'Định nghĩa Hàm', duration: 18, status: 'locked', order: 1 },
        { id: '5-2', title: 'Tham số và Return', duration: 20, status: 'locked', order: 2 },
      ],
    },
    {
      id: '6',
      title: 'Xử lý File và Người nhập',
      weekNumber: 6,
      lessons: [
        { id: '6-1', title: 'Đọc/Ghi File', duration: 25, status: 'locked', order: 1 },
        { id: '6-2', title: 'Input từ User', duration: 15, status: 'locked', order: 2 },
      ],
    },
    {
      id: '7',
      title: 'Lập trình hướng đối tượng cơ bản',
      weekNumber: 7,
      lessons: [
        { id: '7-1', title: 'Class & Object', duration: 30, status: 'locked', order: 1 },
        { id: '7-2', title: 'Methods & Attributes', duration: 25, status: 'locked', order: 2 },
      ],
    },
    {
      id: '8',
      title: 'Module và Package',
      weekNumber: 8,
      lessons: [
        { id: '8-1', title: 'Import Module', duration: 18, status: 'locked', order: 1 },
        { id: '8-2', title: 'Tạo Package', duration: 20, status: 'locked', order: 2 },
      ],
    },
    {
      id: '9',
      title: 'Xử lý ngoại lệ và Exception Handling',
      weekNumber: 9,
      lessons: [
        { id: '9-1', title: 'Try-Except cơ bản', duration: 20, status: 'locked', order: 1 },
        { id: '9-2', title: 'Custom Exception', duration: 22, status: 'locked', order: 2 },
      ],
    },
    {
      id: '10',
      title: 'Làm việc với API và Requests',
      weekNumber: 10,
      lessons: [
        { id: '10-1', title: 'HTTP Requests', duration: 25, status: 'locked', order: 1 },
        { id: '10-2', title: 'JSON Parsing', duration: 20, status: 'locked', order: 2 },
      ],
    },
    {
      id: '11',
      title: 'Dự án nhỏ - Ứng dụng Console',
      weekNumber: 11,
      lessons: [
        { id: '11-1', title: 'Thiết kế ứng dụng', duration: 30, status: 'locked', order: 1 },
        { id: '11-2', title: 'Triển khai và Test', duration: 35, status: 'locked', order: 2 },
      ],
    },
    {
      id: '12',
      title: 'Ôn tập và Mở rộng',
      weekNumber: 12,
      lessons: [
        { id: '12-1', title: 'Ôn tập toàn bộ', duration: 40, status: 'locked', order: 1 },
        { id: '12-2', title: 'Xu hướng tương lai', duration: 20, status: 'locked', order: 2 },
      ],
    },
  ],
}

// ============ COMPONENTS ============

function HeroSection({ course, navigate }: { course: Course; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-400 text-white py-12 px-4 md:py-16 md:px-8 rounded-xl shadow-lg relative overflow-hidden">
      {/* Decorative Icon - Top Left */}
      <div className="absolute top-6 left-8 opacity-80">
        <Globe size={80} className="text-white/30" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{course.title}</h1>

        {/* Badges */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-white/30 text-white border border-white/50">
            Cơ bản
          </span>
          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-white/30 text-white border border-white/50 flex items-center gap-1">
            🌍 Tiếng Việt
          </span>
        </div>

        {/* Description */}
        <p className="text-base md:text-lg opacity-95 mb-8 max-w-3xl leading-relaxed">
          {course.description} Mỗi tuần gồm 7 bài tập thực hành, mỗi bài 1.5-2 giờ, phù hợp với 10 giờ học/tuần.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center gap-2">
            <PlayCircle size={20} />
            Bắt đầu học
          </button>
          <button className="bg-white hover:bg-gray-100 text-teal-600 font-semibold py-3 px-8 rounded-lg transition-colors border-2 border-white shadow-md hover:shadow-lg flex items-center gap-2">
            📋
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}

function StatsBar({ course }: { course: Course }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 -mt-6 relative z-10 px-4">
      {/* Row 1: 4 Main Stats */}
      <StatCard icon={<BookOpen size={28} />} label="Tổng số bài học" value={course.totalLessons} color="text-blue-500" />
      <StatCard icon={<Clock size={28} />} label="Thời gian ước tính" value={`${course.totalHours}h`} color="text-gray-500" />
      <StatCard icon={<Users size={28} />} label="Đã đăng ký" value={course.enrolledStudents.toLocaleString()} color="text-teal-500" />
      <StatCard icon={<Star size={28} />} label="Đánh giá" value={`${course.rating}/5.0`} color="text-yellow-500" />
    </div>
  )
}

function ExtendedStatsBar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 px-4 mb-8">
      {/* Row 2: Additional Stats */}
      <StatCard icon={<FileText size={28} />} label="Tài liệu" value="122" color="text-blue-500" />
      <StatCard icon={<HelpCircle size={28} />} label="Bài kiểm tra" value="125" color="text-orange-500" />
      <StatCard icon={<Zap size={28} />} label="Thử thách" value="141" color="text-purple-500" />
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
      <div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`${color} text-3xl md:text-4xl flex-shrink-0`}>{icon}</div>
    </div>
  )
}

function CurriculumSection({ chapters }: { chapters: Chapter[] }) {
  const [expandedChapters, setExpandedChapters] = useState<string[]>(['1']) // Expand first chapter by default

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => (prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
      case 'in-progress':
        return <PlayCircle size={18} className="text-blue-500 flex-shrink-0" />
      case 'locked':
        return <Lock size={18} className="text-gray-400 flex-shrink-0" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Chương trình học
          <span className="ml-3 text-lg text-gray-600 font-normal">({chapters.reduce((sum, ch) => sum + ch.lessons.length, 0)} bài)</span>
        </h2>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Hoàn tất khóa học
        </button>
      </div>

      <div className="space-y-3">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {/* Chapter Header */}
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 p-4 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-semibold text-sm flex-shrink-0">
                  {chapter.weekNumber}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Tuần {chapter.weekNumber}: {chapter.title}</h3>
                  <p className="text-sm text-gray-600">
                    Week {chapter.weekNumber}: Gồm {chapter.lessons.length} bài học
                  </p>
                </div>
              </div>
              <ChevronDown
                size={20}
                className={`text-gray-600 transition-transform flex-shrink-0 ${expandedChapters.includes(chapter.id) ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Lessons List */}
            {expandedChapters.includes(chapter.id) && (
              <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-2">
                {chapter.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer group"
                  >
                    {getStatusIcon(lesson.status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 group-hover:text-blue-600 truncate">{lesson.title}</p>
                      <p className="text-sm text-gray-500">{lesson.duration} phút</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 whitespace-nowrap ml-2">
                      {lesson.status === 'completed' && 'Đã xong'}
                      {lesson.status === 'in-progress' && 'Đang học'}
                      {lesson.status === 'locked' && 'Khóa'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ReviewSection({ course }: { course: Course }) {
  const [comments, setComments] = useState<Array<{ id: string; author: string; content: string; date: string }>>([
    {
      id: '1',
      author: 'Nguyễn Văn A',
      content: 'Khóa học rất hay, giáo viên giải thích chi tiết. Tôi đã học được rất nhiều điều bổ ích!',
      date: '2 ngày trước',
    },
    {
      id: '2',
      author: 'Trần Thị B',
      content: 'Nội dung dễ hiểu, có bài tập thực hành hay. Recommend cho bạn nào muốn học Python.',
      date: '5 ngày trước',
    },
  ])
  const [newComment, setNewComment] = useState('')

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: String(comments.length + 1),
          author: 'Bạn',
          content: newComment,
          date: 'Vừa xong',
        },
      ])
      setNewComment('')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-12 pb-12">
      {/* Rating Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Đánh giá khóa học</h3>
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-gray-900">{(0.0).toFixed(1)}</p>
          <p className="text-sm text-gray-600">trên 5.0</p>
          <p className="text-xs text-gray-500 mt-2">({course.totalReviews} đánh giá)</p>
        </div>
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          ⭐ Viết trải nghiệm
        </button>
      </div>

      {/* Discussion Section */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Thảo luận</h3>

        {/* Input Comment */}
        <div className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Nhập câu hỏi hoặc bình luận của bạn..."
            maxLength={2000}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">{newComment.length}/2000</span>
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Gửi bình luận
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {comment.author.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{comment.author}</p>
                    <span className="text-xs text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-gray-700 mt-1 text-sm break-words">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============ MAIN COMPONENT ============

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token, user } = useAuthStore()
  const [course, setCourse] = useState<Course | null>(null)

  // Check authentication
  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
      return
    }
  }, [token, user, navigate])

  // Load course data (mock for now, will be replaced with API call)
  useEffect(() => {
    if (id) {
      // TODO: Replace with API call: GET /api/courses/{id}
      // For now, using mock data - will be extended to fetch real data based on courseId
      setCourse(mockCourse)
    }
  }, [id])

  if (!token || !user || !course) {
    return null
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-6 md:py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Hero Section */}
          <HeroSection course={course} navigate={navigate} />

          {/* Stats Bar */}
          <StatsBar course={course} />

          {/* Extended Stats Bar */}
          <ExtendedStatsBar />

          {/* Curriculum Section */}
          <CurriculumSection chapters={course.chapters} />

          {/* Review Section */}
          <ReviewSection course={course} />
        </div>
      </div>
    </Layout>
  )
}
