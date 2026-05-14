import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { RoadmapSection } from '@/components/dashboard/RoadmapSection'
import { HeatmapActivity } from '@/components/dashboard/HeatmapActivity'
import { SkillsSection } from '@/components/dashboard/SkillsSection'
import { Sidebar } from '@/components/dashboard/Sidebar'

export default function Home() {
  const { token, user } = useAuthStore()
  const navigate = useNavigate()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
    }
  }, [token, user, navigate])

  if (!token || !user) {
    return null
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-8">
        {/* Grid Layout: Main (70%) + Sidebar (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Banner */}
            <WelcomeBanner />

            {/* Stats Grid */}
            <StatsGrid />

            {/* Roadmap Section */}
            <RoadmapSection />

            {/* Heatmap Activity */}
            <HeatmapActivity />

            {/* Skills Section */}
            <SkillsSection />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </Layout>
  )
}
