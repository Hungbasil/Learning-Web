import { Brain } from 'lucide-react'

interface SkillItem {
  name: string
  level: number // 0-100
  color: string
}

const skills: SkillItem[] = [
  { name: 'Thuật toán', level: 65, color: 'bg-blue-500' },
  { name: 'Cấu trúc dữ liệu', level: 72, color: 'bg-purple-500' },
  { name: 'Tư duy Logic', level: 58, color: 'bg-green-500' },
  { name: 'Tối ưu mã nguồn', level: 48, color: 'bg-orange-500' },
]

export function SkillsSection() {
  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Kỹ năng & Năng lực</h2>
      </div>

      <div className="space-y-5">
        {skills.map((skill) => (
          <div key={skill.name} className="group">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">{skill.name}</p>
              <span className="text-xs font-bold text-gray-600 group-hover:text-indigo-600 transition-colors duration-200">{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`${skill.color} h-2 rounded-full transition-all duration-700 group-hover:shadow-md`}
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">2/4</p>
          <p className="text-xs text-gray-600 mt-1">Kỹ năng cấp cao</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">60%</p>
          <p className="text-xs text-gray-600 mt-1">Mức độ trung bình</p>
        </div>
      </div>
    </div>
  )
}
