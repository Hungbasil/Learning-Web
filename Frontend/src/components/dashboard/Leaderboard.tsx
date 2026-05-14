import { Trophy, Medal } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  name: string
  xp: number
  streak: number
}

export function Leaderboard() {
  // Dữ liệu mẫu - Top 5 học viên
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, name: 'Nguyễn Văn A', xp: 5820, streak: 28 },
    { rank: 2, name: 'Trần Thị B', xp: 5340, streak: 21 },
    { rank: 3, name: 'Lê Minh C', xp: 4950, streak: 18 },
    { rank: 4, name: 'Phạm Đức D', xp: 4520, streak: 15 },
    { rank: 5, name: 'Hoàng Tuấn E', xp: 4120, streak: 12 },
  ]

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

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-5">
        <Trophy className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
        <h3 className="font-bold text-gray-800">Xếp hạng tuần</h3>
      </div>

      <div className="space-y-2">
        {leaderboardData.map((entry, idx) => (
          <div
            key={entry.rank}
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
              <p className="text-sm font-semibold text-gray-800 truncate">{entry.name}</p>
              <p className="text-xs text-gray-500">{entry.streak} ngày liên tiếp</p>
            </div>

            {/* XP */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-indigo-600">{entry.xp}</p>
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
