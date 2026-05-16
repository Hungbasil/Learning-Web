import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ChevronDown,
  Lock,
  CheckCircle,
  PlayCircle,
  Star,
  Clock,
  BookOpen,
  Users,
  Globe,
  FileText,
  HelpCircle,
  Zap,
  Bookmark,
  Share2,
} from 'lucide-react'
import { Layout } from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'
import { axiosClient } from '@/config/axiosClient'

// ============ INTERFACES & TYPES ============
interface Lesson {
  id: number
  title: string
  duration: number
  status: 'locked' | 'in-progress' | 'completed'
  orderIndex: number
  isFree: boolean
  videoUrl?: string
}

interface Section {
  id: number
  title: string
  orderIndex: number
  lessons: Lesson[]
}

interface CourseDetailResponse {
  id: number
  title: string
  description: string
  price: number
  imageUrl: string
  level: string
  categoryName: string
  instructorName: string
  totalLessons: number
  totalDuration: string
  averageRating: number
  totalReviews: number
  completionPercentage: number
  isFree: boolean
  programmingLanguage: string
  icon: string
  bgColor: string
  enrolledCount: number
  isBookmarked: boolean
  isEnrolled: boolean
  sections: Section[]
}

interface Review {
  id: number
  userId: number
  fullName: string
  rating: number
  comment: string
  createdAt: string
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  starDistribution: Record<number, number>
}

// ============ COMPONENTS ============

function HeroSection({
  course,
  isBookmarked,
  isEnrolled,
  onBookmarkToggle,
  onEnroll,
  isLoadingBookmark,
  isLoadingEnroll,
}: {
  course: CourseDetailResponse
  isBookmarked: boolean
  isEnrolled: boolean
  onBookmarkToggle: () => void
  onEnroll: () => void
  isLoadingBookmark: boolean
  isLoadingEnroll: boolean
}) {
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
            {course.level}
          </span>
          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-white/30 text-white border border-white/50">
            {course.icon} {course.programmingLanguage}
          </span>
          {isEnrolled && (
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-500/30 text-white border border-green-200">
              ✓ Đã đăng ký
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-base md:text-lg opacity-95 mb-8 max-w-3xl leading-relaxed">{course.description}</p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={onEnroll}
            disabled={isEnrolled || isLoadingEnroll}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <PlayCircle size={20} />
            {isLoadingEnroll ? 'Đang xử lý...' : isEnrolled ? 'Đã đăng ký' : 'Bắt đầu học'}
          </button>
          <button
            onClick={onBookmarkToggle}
            disabled={isLoadingBookmark}
            className={`${
              isBookmarked ? 'bg-orange-500 text-white' : 'bg-white text-teal-600'
            } hover:shadow-lg disabled:opacity-70 font-semibold py-3 px-8 rounded-lg transition-colors shadow-md flex items-center gap-2`}
          >
            <Bookmark size={20} fill={isBookmarked ? 'white' : 'none'} />
            {isBookmarked ? 'Đã lưu' : 'Lưu'}
          </button>
          <button className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-lg transition-colors border border-white shadow-md hover:shadow-lg flex items-center gap-2">
            <Share2 size={20} />
            Chia sẻ
          </button>
        </div>
      </div>
    </div>
  )
}

function StatsBar({ course }: { course: CourseDetailResponse }) {
  const parsedHours = parseInt(course.totalDuration) || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 -mt-6 relative z-10 px-4">
      <StatCard icon={<BookOpen size={28} />} label="Tổng số bài học" value={course.totalLessons} color="text-blue-500" />
      <StatCard
        icon={<Clock size={28} />}
        label="Thời gian ước tính"
        value={`${parsedHours}h`}
        color="text-gray-500"
      />
      <StatCard
        icon={<Users size={28} />}
        label="Đã đăng ký"
        value={course.enrolledCount.toLocaleString()}
        color="text-teal-500"
      />
      <StatCard
        icon={<Star size={28} />}
        label="Đánh giá"
        value={`${course.averageRating.toFixed(1)}/5.0`}
        color="text-yellow-500"
      />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
}) {
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

function CurriculumSection({ sections, courseTitle }: { sections: Section[]; courseTitle: string }) {
  const [expandedSections, setExpandedSections] = useState<number[]>(sections.length > 0 ? [sections[0].id] : [])
  const totalLessons = useMemo(() => sections.reduce((sum, s) => sum + s.lessons.length, 0), [sections])

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    )
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
          <span className="ml-3 text-lg text-gray-600 font-normal">({totalLessons} bài)</span>
        </h2>
      </div>

      <div className="space-y-3">
        {sections.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Chưa có chương trình học</p>
        ) : (
          sections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 p-4 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-semibold text-sm flex-shrink-0">
                    {section.orderIndex || sections.indexOf(section) + 1}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-600">Gồm {section.lessons.length} bài học</p>
                  </div>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-600 transition-transform flex-shrink-0 ${
                    expandedSections.includes(section.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Lessons List */}
              {expandedSections.includes(section.id) && (
                <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-2">
                  {section.lessons.map((lesson) => (
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
          ))
        )}
      </div>
    </div>
  )
}

function ReviewSection({ courseId, isEnrolled }: { courseId: number; isEnrolled: boolean }) {
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ['courseReviews', courseId],
    queryFn: async () => {
      const response = await axiosClient.get(`/courses/${courseId}/reviews`)
      return response.data
    },
  })

  const { data: reviewStats } = useQuery<ReviewStats>({
    queryKey: ['reviewStats', courseId],
    queryFn: async () => {
      const response = await axiosClient.get(`/courses/${courseId}/reviews/stats`)
      return response.data
    },
  })

  const [newComment, setNewComment] = useState('')
  const [rating, setRating] = useState(5)
  const queryClient = useQueryClient()

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      return axiosClient.post(`/courses/${courseId}/reviews`, {
        rating,
        comment: newComment,
      })
    },
    onSuccess: () => {
      setNewComment('')
      setRating(5)
      queryClient.invalidateQueries({ queryKey: ['courseReviews', courseId] })
      queryClient.invalidateQueries({ queryKey: ['reviewStats', courseId] })
    },
  })

  const handleAddReview = () => {
    if (newComment.trim() || rating > 0) {
      submitReviewMutation.mutate()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-12 pb-12">
      {/* Rating Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Đánh giá khóa học</h3>
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-gray-900">{(reviewStats?.averageRating || 0).toFixed(1)}</p>
          <div className="flex justify-center gap-1 my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className={
                  i < Math.round(reviewStats?.averageRating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">trên 5.0</p>
          <p className="text-xs text-gray-500 mt-2">({reviewStats?.totalReviews || 0} đánh giá)</p>
        </div>

        {/* Star Distribution */}
        {reviewStats?.starDistribution && (
          <div className="space-y-2 mb-6 text-sm">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="w-6">{star}★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${(
                        ((reviewStats.starDistribution[star] || 0) / (reviewStats.totalReviews || 1)) *
                        100
                      ).toFixed(0)}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right">{reviewStats.starDistribution[star] || 0}</span>
              </div>
            ))}
          </div>
        )}

        {isEnrolled && (
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            ⭐ Viết trải nghiệm
          </button>
        )}
      </div>

      {/* Discussion Section */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Thảo luận ({reviews.length})</h3>

        {isEnrolled && (
          <>
            {/* Rating Input */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <label className="text-sm font-medium text-gray-700 block mb-2">Đánh giá của bạn</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Input */}
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Nhập bình luận của bạn..."
                maxLength={1000}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{newComment.length}/1000</span>
                <button
                  onClick={handleAddReview}
                  disabled={!newComment.trim() || submitReviewMutation.isPending}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {submitReviewMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {reviewsLoading ? (
            <p className="text-center text-gray-500 py-4">Đang tải đánh giá...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Chưa có đánh giá nào</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {review.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{review.fullName}</p>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 mt-2 text-sm break-words">{review.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
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
  const queryClient = useQueryClient()

  // Check authentication
  if (!token || !user) {
    navigate('/login')
    return null
  }

  // Fetch course data from API
  const { data: course, isLoading, error } = useQuery<CourseDetailResponse>({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await axiosClient.get(`/courses/${id}`)
      return response.data
    },
    enabled: !!id && !!token,
  })

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      return axiosClient.post(`/bookmarks/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', id] })
    },
  })

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: async () => {
      return axiosClient.post(`/learning/enroll/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', id] })
    },
  })

  const handleBookmarkToggle = () => {
    bookmarkMutation.mutate()
  }

  const handleEnroll = () => {
    enrollMutation.mutate()
  }

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-100 py-6 md:py-8">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="bg-gradient-to-r from-teal-400 to-emerald-400 rounded-xl h-72 animate-pulse mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-24 animate-pulse" />
              ))}
            </div>
            <div className="bg-white rounded-lg p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // Error state
  if (error || !course) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-100 py-6 md:py-8">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-red-700 mb-2">Lỗi tải khóa học</h2>
              <p className="text-red-600 mb-6">
                {error instanceof Error ? error.message : 'Không thể tải thông tin khóa học. Vui lòng thử lại sau.'}
              </p>
              <button
                onClick={() => navigate('/roadmaps')}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Quay lại lộ trình
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-6 md:py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Hero Section */}
          <HeroSection
            course={course}
            isBookmarked={course.isBookmarked}
            isEnrolled={course.isEnrolled}
            onBookmarkToggle={handleBookmarkToggle}
            onEnroll={handleEnroll}
            isLoadingBookmark={bookmarkMutation.isPending}
            isLoadingEnroll={enrollMutation.isPending}
          />

          {/* Stats Bar */}
          <StatsBar course={course} />

          {/* Curriculum Section */}
          <CurriculumSection sections={course.sections} courseTitle={course.title} />

          {/* Review Section */}
          <ReviewSection courseId={course.id} isEnrolled={course.isEnrolled} />
        </div>
      </div>
    </Layout>
  )
}
