import { useAuthStore } from '@/store/authStore'
import { Trophy, Flame, Zap, TrendingUp } from 'lucide-react'
import { StatsCard } from './StatsCard'

export function StatsGrid() {
  const { user } = useAuthStore()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
      <StatsCard
        icon={<Trophy className="w-5 h-5 md:w-6 md:h-6" />}
        label="Tổng XP"
        value={user?.totalXp || 0}
        unit="XP"
        color="yellow"
      />
      <StatsCard
        icon={<Flame className="w-5 h-5 md:w-6 md:h-6" />}
        label="Chuỗi ngày"
        value={0}
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
        value={0}
        unit="%"
        color="blue"
      />
    </div>
  )
}
