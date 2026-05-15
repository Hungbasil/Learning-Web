import { useEffect, useState } from 'react'
import { Target, Flame, Trophy } from 'lucide-react'
import { axiosClient } from '@/config/axiosClient'

interface Goal {
  id: number
  title: string
  deadline: string
  targetValue: number
  currentProgress: number
  status: string
}

interface GoalsResponse {
  goals: Goal[]
}

export function PersonalGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axiosClient.get('/dashboard/goals')
        const data: GoalsResponse = response.data
        setGoals(data.goals)
      } catch (error) {
        console.error('Error fetching goals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGoals()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 sticky top-20 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-5">
          <Target className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
          <h3 className="font-bold text-gray-800">Mục tiêu cá nhân</h3>
        </div>
        <p className="text-gray-500">Đang tải...</p>
      </div>
    )
  }

  // Calculate streak and trophies from goals for display
  const completedGoals = goals.filter(g => g.status === 'completed').length
  const inProgressGoals = goals.filter(g => g.status === 'in_progress').length

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 sticky top-20 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-5">
        <Target className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
        <h3 className="font-bold text-gray-800">Mục tiêu cá nhân</h3>
      </div>

      {goals.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Chưa có mục tiêu nào. Hãy tạo mục tiêu học tập!</p>
      ) : (
        <div className="space-y-6">
          {/* Streak Goal */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 hover:shadow-md transition-all duration-200 hover:border-orange-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-semibold text-gray-800">Đang học</span>
              </div>
              <span className="text-xl font-bold text-orange-600">{inProgressGoals} mục tiêu</span>
            </div>
            <p className="text-xs text-gray-600">Mục tiêu: Hoàn thành tất cả các mục tiêu</p>
            <div className="w-full bg-orange-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-orange-500 h-1.5 rounded-full transition-all duration-700"
                style={{ width: inProgressGoals > 0 ? '50%' : '0%' }}
              />
            </div>
          </div>

          {/* Trophy Goal */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200 hover:shadow-md transition-all duration-200 hover:border-yellow-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-gray-800">Hoàn thành</span>
              </div>
              <span className="text-xl font-bold text-yellow-600">{completedGoals} mục tiêu</span>
            </div>
            <p className="text-xs text-gray-600">Mục tiêu: Hoàn thành 10 mục tiêu</p>
            <div className="w-full bg-yellow-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-yellow-500 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${Math.min((completedGoals / 10) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Recent goals */}
          {goals.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-600 mb-2">Mục tiêu gần đây</h4>
              <ul className="space-y-1">
                {goals.slice(0, 3).map((goal) => (
                  <li key={goal.id} className="text-xs text-gray-600 flex items-center gap-2">
                    <span className="w-1 h-1 bg-indigo-600 rounded-full"></span>
                    {goal.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
