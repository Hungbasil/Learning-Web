import { MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function RoadmapSection() {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Lộ trình đang học</h2>
      </div>

      <div className="text-center py-8 md:py-10">
        <p className="text-gray-500 text-sm md:text-base mb-6">
          Bạn chưa có lộ trình nào đang học dở
        </p>
        <button
          onClick={() => navigate('/roadmaps')}
          className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95"
        >
          Duyệt lộ trình
        </button>
      </div>
    </div>
  )
}
