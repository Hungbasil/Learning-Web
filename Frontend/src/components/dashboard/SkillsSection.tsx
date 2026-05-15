import { useEffect, useState } from 'react'
import { Brain } from 'lucide-react'
import { axiosClient } from '@/config/axiosClient'

interface SkillItem {
  id: number
  skillName: string
  proficiency: string
  progress: number // 0-100
}

interface SkillsResponse {
  skills: SkillItem[]
}

export function SkillsSection() {
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axiosClient.get('/dashboard/skills')
        const data: SkillsResponse = response.data
        setSkills(data.skills)
      } catch (error) {
        console.error('Error fetching skills:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  const getColorByProgress = (progress: number): string => {
    if (progress < 33) return 'bg-orange-500'
    if (progress < 66) return 'bg-blue-500'
    return 'bg-green-500'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Kỹ năng & Năng lực</h2>
        </div>
        <p className="text-gray-500">Đang tải...</p>
      </div>
    )
  }

  const advancedSkills = skills.filter(s => s.proficiency === 'Advanced').length
  const averageProgress = skills.length > 0 ? Math.round(skills.reduce((sum, s) => sum + s.progress, 0) / skills.length) : 0

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Kỹ năng & Năng lực</h2>
      </div>

      {skills.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Chưa có kỹ năng nào. Hãy hoàn thành các khóa học để mở khóa kỹ năng!</p>
      ) : (
        <>
          <div className="space-y-5">
            {skills.map((skill) => (
              <div key={skill.id} className="group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">{skill.skillName}</p>
                  <span className="text-xs font-bold text-gray-600 group-hover:text-indigo-600 transition-colors duration-200">{skill.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${getColorByProgress(skill.progress)} h-2 rounded-full transition-all duration-700 group-hover:shadow-md`}
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{advancedSkills}/{skills.length}</p>
              <p className="text-xs text-gray-600 mt-1">Kỹ năng cấp cao</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{averageProgress}%</p>
              <p className="text-xs text-gray-600 mt-1">Mức độ trung bình</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
