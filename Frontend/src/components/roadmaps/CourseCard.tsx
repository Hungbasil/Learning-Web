import { ChevronRight, Clock, BookOpen, Users } from 'lucide-react'

export interface Course {
  id: string
  title: string
  description: string
  level: 'Cơ bản' | 'Trung cấp' | 'Nâng cao'
  language: string
  programmingLanguage: string
  techStack: string[]
  duration: number
  lessons: number
  enrolled: number
  bgColor: string
  icon: string
  isFree: boolean
}

interface CourseCardProps {
  course: Course
  onViewDetails: (courseId: string) => void
}

export default function CourseCard({ course, onViewDetails }: CourseCardProps) {
  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'Cơ bản':
        return 'bg-green-100 text-green-700'
      case 'Trung cấp':
        return 'bg-yellow-100 text-yellow-700'
      case 'Nâng cao':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getTechStackColor = (index: number): string => {
    const colors = [
      'bg-purple-100 text-purple-700',
      'bg-indigo-100 text-indigo-700',
      'bg-blue-100 text-blue-700',
      'bg-pink-100 text-pink-700',
    ]
    return colors[index % colors.length]
  }

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer group"
      onClick={() => onViewDetails(course.id)}
    >
      {/* Top Section - Background Color + Icon */}
      <div
        className={`${course.bgColor} h-32 flex items-center justify-center relative overflow-hidden`}
      >
        <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {course.icon}
        </div>
      </div>

      {/* Body Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-3">
          {course.title}
        </h3>

        {/* Tags/Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Level Badge */}
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}
          >
            {course.level}
          </span>

          {/* Language Badge */}
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {course.language}
          </span>

          {/* Tech Stack Badges */}
          {course.techStack.slice(0, 2).map((tech, index) => (
            <span
              key={tech}
              className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getTechStackColor(index)}`}
            >
              {tech}
            </span>
          ))}
          {course.techStack.length > 2 && (
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              +{course.techStack.length - 2}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}h</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.lessons} bài</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.enrolled.toLocaleString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* Footer - View Details Button */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <button
          className="w-full flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm group-hover:gap-3 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation()
            onViewDetails(course.id)
          }}
        >
          Xem chi tiết
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
