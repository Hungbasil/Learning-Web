import { useEffect, useState } from 'react'
import { MapPin, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axiosClient  from '@/config/axiosClient'

interface EnrolledCourse {
  courseId: number
  title: string
  imageUrl: string
  totalLessons: number
  completedLessons: number
  progressPercent: number
}

interface DashboardResponse {
  totalEnrolledCourses: number
  totalCompletedCourses: number
  inProgressCourses: EnrolledCourse[]
}

export function RoadmapSection() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axiosClient.get<DashboardResponse>('/dashboard/my-progress')
        setCourses(response.data.inProgressCourses)
      } catch (error) {
        console.error('Error fetching enrolled courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrolledCourses()
  }, [])

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Khóa Học đang học</h2>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">Đang tải...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-8 md:py-10">
          <p className="text-gray-500 text-sm md:text-base mb-6">
            Bạn chưa có Khóa Học nào đang học dở
          </p>
          <button
            onClick={() => navigate('/roadmaps')}
            className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            Duyệt Khóa Học
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <div
              key={course.courseId}
              onClick={() => navigate(`/courses/${course.courseId}`)}
              className="flex items-center gap-4 p-3 md:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
            >
              {/* Course Image */}
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                {course.imageUrl && course.imageUrl.trim() !== '' ? (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    onError={(e) => {
                      // If image fails to load, hide it and show the fallback
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                    <BookOpen className="w-8 h-8 text-indigo-600" />
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate group-hover:text-indigo-600">
                  {course.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  {course.completedLessons}/{course.totalLessons} bài
                </p>

                {/* Progress Bar */}
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Progress Percent */}
              <div className="flex-shrink-0 text-right">
                <p className="font-semibold text-indigo-600 text-sm md:text-base">
                  {Math.round(course.progressPercent)}%
                </p>
              </div>
            </div>
          ))}

          {courses.length > 0 && (
            <button
              onClick={() => navigate('/roadmaps')}
              className="w-full mt-4 px-4 py-2 text-center text-sm md:text-base text-indigo-600 hover:text-indigo-700 font-semibold rounded-lg border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
            >
              Xem thêm khóa học
            </button>
          )}
        </div>
      )}
    </div>
  )
}
