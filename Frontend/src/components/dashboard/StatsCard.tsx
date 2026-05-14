import type { ReactNode } from 'react'

interface StatsCardProps {
  icon: ReactNode
  label: string
  value: string | number
  unit?: string
  color: 'yellow' | 'green' | 'purple' | 'blue' | 'orange'
}

const colorStyles = {
  yellow: 'bg-yellow-50 border-yellow-100 text-yellow-600',
  green: 'bg-green-50 border-green-100 text-green-600',
  purple: 'bg-purple-50 border-purple-100 text-purple-600',
  blue: 'bg-blue-50 border-blue-100 text-blue-600',
  orange: 'bg-orange-50 border-orange-100 text-orange-600',
}

const iconBgStyles = {
  yellow: 'bg-yellow-100',
  green: 'bg-green-100',
  purple: 'bg-purple-100',
  blue: 'bg-blue-100',
  orange: 'bg-orange-100',
}

export function StatsCard({ icon, label, value, unit, color }: StatsCardProps) {
  return (
    <div className={`rounded-xl p-4 md:p-5 shadow-sm border ${colorStyles[color]} hover:shadow-lg hover:scale-105 transition-all duration-300 hover:border-opacity-50 cursor-default`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={`rounded-lg p-2.5 ${iconBgStyles[color]} transform transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">{label}</p>
      <p className="text-xl md:text-2xl font-bold text-gray-800">
        {value}
        {unit && <span className="text-xs md:text-sm ml-1 text-gray-500">{unit}</span>}
      </p>
    </div>
  )
}
