import { Target, Flame, Trophy } from 'lucide-react'

export function PersonalGoals() {
  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 mb-6 lg:sticky lg:top-24 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-5">
        <Target className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
        <h3 className="font-bold text-gray-800">Mục tiêu cá nhân</h3>
      </div>

      <div className="space-y-4">
        {/* Streak Goal */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 hover:shadow-md transition-all duration-200 hover:border-orange-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-gray-800">Chuỗi ngày</span>
            </div>
            <span className="text-xl font-bold text-orange-600">0 ngày</span>
          </div>
          <p className="text-xs text-gray-600">Mục tiêu: 30 ngày liên tiếp</p>
          <div className="w-full bg-orange-200 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-700" style={{ width: '0%' }} />
          </div>
        </div>

        {/* Trophy Goal */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200 hover:shadow-md transition-all duration-200 hover:border-yellow-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-gray-800">Cúp đạt được</span>
            </div>
            <span className="text-xl font-bold text-yellow-600">0 cúp</span>
          </div>
          <p className="text-xs text-gray-600">Mục tiêu: Kiếm được 10 cúp</p>
          <div className="w-full bg-yellow-200 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-yellow-500 h-1.5 rounded-full transition-all duration-700" style={{ width: '0%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
