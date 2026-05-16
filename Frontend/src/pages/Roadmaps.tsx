import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import CourseCard, { type Course } from '@/components/roadmaps/CourseCard'
import { Search, Grid3x3, List, ChevronLeft, ChevronRight } from 'lucide-react'

const DUMMY_COURSES: Course[] = [
  {
    id: '1',
    title: 'Lộ trình JavaScript từ Cơ bản đến Nâng cao',
    description: 'Lộ trình 9 tuần giúp người mới bắt đầu học JavaScriptcó thể sử dụng JavaScript để xây dựng các ứng dụng web.',
    level: 'Cơ bản',
    language: 'Tiếng Việt',
    programmingLanguage: 'JavaScript',
    techStack: ['JavaScript'],
    duration: 32,
    lessons: 362,
    enrolled: 18234,
    bgColor: 'bg-yellow-100',
    icon: '🌍',
    isFree: true,
  },
  {
    id: '2',
    title: 'Lộ trình Python từ Cơ bản đến Nâng cao',
    description: 'Lộ trình 12 tuần giúp người mới bắt đầu học Python có thể sử dụng Python để xây dựng các ứng dụng web.',
    level: 'Cơ bản',
    language: 'Tiếng Việt',
    programmingLanguage: 'Python',
    techStack: ['Python'],
    duration: 45,
    lessons: 420,
    enrolled: 22150,
    bgColor: 'bg-green-100',
    icon: '🐍',
    isFree: true,
  },
  {
    id: '3',
    title: 'Lộ trình học C++ từ Cơ bản đến Nâng cao',
    description: 'Lộ trình hệ thống 16 tuần giúp bạn nắm sâu C++ có thể sử dụng C++ để xây dựng các ứng dụng phức tạp.',
    level: 'Cơ bản',
    language: 'Tiếng Việt',
    programmingLanguage: 'C++',
    techStack: ['C++'],
    duration: 58,
    lessons: 230,
    enrolled: 12890,
    bgColor: 'bg-blue-100',
    icon: '⚙️',
    isFree: false,
  },
  {
    id: '4',
    title: 'Lộ trình học React từ Cơ bản đến Nâng cao',
    description: 'Lộ trình 8 tuần giúp bạn nắm sâu React. Học cách xây dựng các ứng dụng web hiện đại với React.',
    level: 'Trung cấp',
    language: 'Tiếng Việt',
    programmingLanguage: 'JavaScript',
    techStack: ['React', 'JavaScript'],
    duration: 42,
    lessons: 167,
    enrolled: 15234,
    bgColor: 'bg-cyan-100',
    icon: '⚛️',
    isFree: false,
  },
  {
    id: '5',
    title: 'Lộ trình Java Developer - Từ Intermediate đến Job-ready',
    description: 'Lộ trình 12 tuần luyện tập hướng chuẩn đầu vào kỳ tuyển dụng. Phát triển kỹ năng Java Developer theo chuẩn đầu vào của các công ty công nghệ lớn.',
    level: 'Trung cấp',
    language: 'Tiếng Việt',
    programmingLanguage: 'Java',
    techStack: ['Java'],
    duration: 170,
    lessons: 336,
    enrolled: 8923,
    bgColor: 'bg-red-100',
    icon: '🚀',
    isFree: false,
  },
  {
    id: '6',
    title: 'Lộ trình nâng cao kỹ năng Python cho lập trình viên',
    description: 'Lộ trình 4 tuần tập trung vào các chủ đề nâng cao: Lập trình hàm, xử lý ngoại lệ, lập trình đa luồng, lập trình mạng và xử lý dữ liệu lớn.',
    level: 'Nâng cao',
    language: 'Tiếng Việt',
    programmingLanguage: 'Python',
    techStack: ['Python'],
    duration: 40,
    lessons: 122,
    enrolled: 5234,
    bgColor: 'bg-indigo-100',
    icon: '🎯',
    isFree: false,
  },
  {
    id: '7',
    title: 'Lộ trình Machine Learning cho Developer',
    description: 'Lộ trình toàn diện về Machine Learning từ cơ bản đến nâng cao, giúp bạn xây dựng các mô hình ML cho sản phẩm thực tế.',
    level: 'Nâng cao',
    language: 'Tiếng Việt',
    programmingLanguage: 'Python',
    techStack: ['Machine Learning', 'Python'],
    duration: 112,
    lessons: 111,
    enrolled: 3456,
    bgColor: 'bg-amber-100',
    icon: '🤖',
    isFree: false,
  },
  {
    id: '8',
    title: 'Lộ trình JavaScript Fullstack từ Cơ bản đến Ứng dụng Web',
    description: 'Lộ trình 12 tuần giải giúp bạn trở thành Full-stack Developer sử dụng JavaScript, giúp xây dựng các ứng dụng web đầy đủ.',
    level: 'Cơ bản',
    language: 'Tiếng Việt',
    programmingLanguage: 'JavaScript',
    techStack: ['JavaScript'],
    duration: 120,
    lessons: 102,
    enrolled: 8234,
    bgColor: 'bg-pink-100',
    icon: '💻',
    isFree: true,
  },
  {
    id: '9',
    title: 'Lộ trình học Flutter từ Cơ bản đến Nâng cao',
    description: 'Lộ trình 8 tuần hành học Flutter. Học cách xây dựng các ứng dụng di động đa nền tảng với Flutter.',
    level: 'Cơ bản',
    language: 'Tiếng Việt',
    programmingLanguage: 'Dart',
    techStack: ['Flutter'],
    duration: 50,
    lessons: 106,
    enrolled: 2341,
    bgColor: 'bg-teal-100',
    icon: '📱',
    isFree: true,
  },
  {
    id: '10',
    title: 'Lộ trình học C# từ Beginner đến Job-ready Development',
    description: 'Lộ trình 8 tuần hành học C#. Sau khóa học này bạn sẽ hiểu rõ nhất những kiến thức nền tảng của C#.',
    level: 'Cơ bản',
    language: 'Tiếng Việt',
    programmingLanguage: 'C#',
    techStack: ['C#'],
    duration: 100,
    lessons: 100,
    enrolled: 2341,
    bgColor: 'bg-violet-100',
    icon: '🎮',
    isFree: true,
  },
  {
    id: '11',
    title: 'Lộ trình học Java từ Cơ bản đến Nâng cao',
    description: 'Lộ trình 12 tuần hoàn hảo để học Java. Sau khóa học này bạn sẽ trở thành Java Developer chuyên nghiệp.',
    level: 'Cơ bản',
    language: 'Tiếng Việt',
    programmingLanguage: 'Java',
    techStack: ['Java'],
    duration: 74,
    lessons: 290,
    enrolled: 9867,
    bgColor: 'bg-orange-100',
    icon: '☕',
    isFree: true,
  },
]

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

  const filteredCourses = useMemo(() => {
    let result = DUMMY_COURSES

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
  }, [filters])

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
