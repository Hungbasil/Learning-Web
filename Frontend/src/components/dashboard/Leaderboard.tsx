import { useEffect, useState } from 'react'
import { Trophy, Medal } from 'lucide-react'
import { axiosClient } from '@/config/axiosClient'

interface LeaderboardEntry {
  rank: number
  userId: number
  fullName: string
  totalXp: number
  streak?: number
}

export function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axiosClient.get('/dashboard/leaderboard?limit=5&offset=0')
        setLeaderboardData(response.data.data)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />
      default:
        return <div className="w-5 h-5 text-center text-xs font-bold text-gray-600">{rank}</div>
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-5">
          <Trophy className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
          <h3 className="font-bold text-gray-800">Xếp hạng tuần</h3>
        </div>
        <p className="text-gray-500">Đang tải...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-5">
        <Trophy className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
        <h3 className="font-bold text-gray-800">Xếp hạng tuần</h3>
      </div>

      <div className="space-y-2">
        {leaderboardData.map((entry, idx) => (
          <div
            key={entry.userId}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              idx === 0 ? 'bg-yellow-50 border border-yellow-200 hover:shadow-md' : 'hover:bg-gray-50 hover:shadow-sm'
            }`}
          >
            {/* Rank */}
            <div className="flex items-center justify-center flex-shrink-0">
              {getMedalIcon(entry.rank)}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{entry.fullName}</p>
              <p className="text-xs text-gray-500">{entry.streak || 0} ngày liên tiếp</p>
            </div>

            {/* XP */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-indigo-600">{entry.totalXp}</p>
              <p className="text-xs text-gray-500">XP</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200">
        Xem bảng xếp hạng đầy đủ
      </button>
    </div>
  )
}
