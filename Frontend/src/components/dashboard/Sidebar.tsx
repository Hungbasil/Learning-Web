import { PersonalGoals } from './PersonalGoals'
import { QuickAccess } from './QuickAccess'
import { Leaderboard } from './Leaderboard'
import { PremiumBanner } from './PremiumBanner'

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-6">
      <PersonalGoals />
      <QuickAccess />
      <Leaderboard />
      <PremiumBanner />
    </aside>
  )
}
