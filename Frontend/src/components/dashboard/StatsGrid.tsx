import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Trophy, Flame, Zap, TrendingUp } from 'lucide-react'
import { StatsCard } from './StatsCard'
import axiosClient  from '@/config/axiosClient'

interface DashboardStats {
  totalXp: number
  rank: number
  streakDays: number
  totalStudyHours: number
  totalCoursesCompleted: number
  skillsAcquired: number
  currentLevel: string
}

export function StatsGrid() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosClient.get('/dashboard/stats')
        setStats(response.data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatsCard icon={<Trophy className="w-5 h-5 md:w-6 md:h-6" />} label="Tổng XP" value={0} unit="XP" color="yellow" />
        <StatsCard icon={<Flame className="w-5 h-5 md:w-6 md:h-6" />} label="Chuỗi ngày" value={0} unit="ngày" color="orange" />
        <StatsCard icon={<Zap className="w-5 h-5 md:w-6 md:h-6" />} label="Token AI" value={0} unit="lượt" color="purple" />
        <StatsCard icon={<TrendingUp className="w-5 h-5 md:w-6 md:h-6" />} label="Tiến độ" value={0} unit="%" color="blue" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
      <StatsCard
        icon={<Trophy className="w-5 h-5 md:w-6 md:h-6" />}
        label="Tổng XP"
        value={stats.totalXp}
        unit="XP"
        color="yellow"
      />
      <StatsCard
        icon={<Flame className="w-5 h-5 md:w-6 md:h-6" />}
        label="Chuỗi ngày"
        value={stats.streakDays}
        unit="ngày"
        color="orange"
      />
      <StatsCard
        icon={<Zap className="w-5 h-5 md:w-6 md:h-6" />}
        label="Token AI"
        value={user?.aiTokens || 0}
        unit="lượt"
        color="purple"
      />
      <StatsCard
        icon={<TrendingUp className="w-5 h-5 md:w-6 md:h-6" />}
        label="Tiến độ"
        value={stats.totalCoursesCompleted}
        unit="khóa"
        color="blue"
      />
    </div>
  )
}
