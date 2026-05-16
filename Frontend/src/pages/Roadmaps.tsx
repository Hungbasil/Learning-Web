import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { axiosClient } from '@/config/axiosClient'
import { Layout } from '@/components/Layout'
import CourseCard, { type Course } from '@/components/roadmaps/CourseCard'
import { Search, Grid3x3, List, ChevronLeft, ChevronRight } from 'lucide-react'

// API Response Type
interface CourseAPIResponse {
  id: number
  title: string
  description: string
  level: string
  imageUrl: string
  price: number
  isFree: boolean
  programmingLanguage: string
  categoryName: string
  instructorName: string
  totalLessons: number
  totalDuration: string
  icon: string
  bgColor: string
  enrolledCount: number
}

// Fetch courses from API
const fetchCourses = async (): Promise<Course[]> => {
  const response = await axiosClient.get<CourseAPIResponse[]>('/courses')
  return response.data.map((course) => ({
    id: course.id.toString(),
    title: course.title,
    description: course.description,
    level: (course.level as 'Cơ bản' | 'Trung cấp' | 'Nâng cao') || 'Cơ bản',
    language: 'Tiếng Việt',
    programmingLanguage: course.programmingLanguage || 'JavaScript',
    techStack: course.programmingLanguage ? [course.programmingLanguage] : ['JavaScript'],
    duration: parseInt(course.totalDuration) || 0,
    lessons: course.totalLessons || 0,
    enrolled: course.enrolledCount || 0,
    bgColor: course.bgColor || 'bg-blue-100',
    icon: course.icon || '💻',
    isFree: course.isFree ?? false,
  }))
}

interface FilterState {
  search: string
  difficulty: 'all' | 'Cơ bản' | 'Trung cấp' | 'Nâng cao'
  pricing: 'all' | 'free' | 'paid'
  programmingLanguage: 'all' | 'JavaScript' | 'Python' | 'Java' | 'C++' | 'C#' | 'Dart'
  sort: 'rating' | 'newest' | 'popular'
  language: 'all' | 'Tiếng Việt' | 'English'
  viewMode: 'grid' | 'list'
}

export default function Roadmaps() {
  const { token, user } = useAuthStore()
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    difficulty: 'all',
    pricing: 'all',
    programmingLanguage: 'all',
    sort: 'popular',
    language: 'all',
    viewMode: 'grid',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Fetch courses from Backend API
  const { data: courses = [], isLoading, error } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    enabled: !!token,
  })

  const filteredCourses = useMemo(() => {
    let result = courses

    // Filter by search
    if (filters.search) {
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          course.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Filter by difficulty
    if (filters.difficulty !== 'all') {
      result = result.filter((course) => course.level === filters.difficulty)
    }

    // Filter by pricing
    if (filters.pricing !== 'all') {
      result = result.filter((course) =>
        filters.pricing === 'free' ? course.isFree : !course.isFree
      )
    }

    // Filter by programming language
    if (filters.programmingLanguage !== 'all') {
      result = result.filter(
        (course) => course.programmingLanguage === filters.programmingLanguage
      )
    }

    // Filter by language
    if (filters.language !== 'all') {
      result = result.filter((course) => course.language === filters.language)
    }

    // Sort
    if (filters.sort === 'rating') {
      result = result.sort((a, b) => b.enrolled - a.enrolled)
    } else if (filters.sort === 'newest') {
      result = result.reverse()
    } else if (filters.sort === 'popular') {
      result = result.sort((a, b) => b.enrolled - a.enrolled)
    }

    return result
  }, [filters, courses])

  const paginatedCourses = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage
    return filteredCourses.slice(startIdx, startIdx + itemsPerPage)
  }, [filteredCourses, currentPage])

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)

  const handleViewDetails = (courseId: string) => {
    console.log(`Viewing course: ${courseId}`)
    // TODO: Navigate to course details page
  }

  if (!token || !user) {
    return null
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Duyệt lộ trình học tập</h1>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 items-end">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={filters.search}
                  onChange={(e) => {
                    setFilters({ ...filters, search: e.target.value })
                    setCurrentPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Độ khó
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    difficulty: e.target.value as FilterState['difficulty'],
                  })
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Tất cả</option>
                <option value="Cơ bản">Cơ bản</option>
                <option value="Trung cấp">Trung cấp</option>
                <option value="Nâng cao">Nâng cao</option>
              </select>
            </div>

            {/* Pricing Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá
              </label>
              <select
                value={filters.pricing}
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    pricing: e.target.value as FilterState['pricing'],
                  })
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Tất cả</option>
                <option value="free">Miễn phí</option>
                <option value="paid">Trả phí</option>
              </select>
            </div>

            {/* Programming Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngôn ngữ lập trình
              </label>
              <select
                value={filters.programmingLanguage}
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    programmingLanguage: e.target.value as FilterState['programmingLanguage'],
                  })
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Tất cả</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="C#">C#</option>
                <option value="Dart">Dart</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp
              </label>
              <select
                value={filters.sort}
                onChange={(e) => {
                  setFilters({ ...filters, sort: e.target.value as FilterState['sort'] })
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="popular">Phổ biến</option>
                <option value="newest">Mới nhất</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngôn ngữ
              </label>
              <select
                value={filters.language}
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    language: e.target.value as FilterState['language'],
                  })
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Tất cả</option>
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="English">English</option>
              </select>
            </div>

            {/* View Mode Toggle - Right aligned */}
            <div className="lg:col-span-1 flex gap-2 justify-end">
              <button
                onClick={() => setFilters({ ...filters, viewMode: 'grid' })}
                className={`p-2.5 rounded-lg transition-colors ${
                  filters.viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Grid view"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setFilters({ ...filters, viewMode: 'list' })}
                className={`p-2.5 rounded-lg transition-colors ${
                  filters.viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 animate-pulse rounded-xl h-96"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
            <p className="text-red-700 font-semibold">Lỗi: Không thể tải danh sách khóa học</p>
            <p className="text-red-600 text-sm mt-2">{error instanceof Error ? error.message : 'Vui lòng thử lại sau'}</p>
          </div>
        ) : (
          <div
            className={
              filters.viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'
                : 'space-y-4 mb-8'
            }
          >
            {paginatedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {paginatedCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không tìm thấy khóa học nào</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm text-gray-600 mr-4">
              {Math.min((currentPage - 1) * itemsPerPage + 1, filteredCourses.length)}-
              {Math.min(currentPage * itemsPerPage, filteredCourses.length)} trong{' '}
              {filteredCourses.length} lộ trình
            </span>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              {totalPages > 5 && (
                <>
                  <span className="px-2 py-1.5 text-gray-600">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-4"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
