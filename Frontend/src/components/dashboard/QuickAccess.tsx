import { Code2, MessageSquare, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface QuickAccessItem {
  icon: React.ReactNode
  label: string
  color: string
  path: string
}

export function QuickAccess() {
  const navigate = useNavigate()

  const items: QuickAccessItem[] = [
    {
      icon: <Code2 className="w-6 h-6" />,
      label: 'Thử thách Code',
      color: 'bg-blue-500 hover:bg-blue-600',
      path: '/challenges',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      label: 'Hỏi đáp',
      color: 'bg-purple-500 hover:bg-purple-600',
      path: '/qa',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Lộ trình',
      color: 'bg-pink-500 hover:bg-pink-600',
      path: '/roadmaps',
    },
  ]

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-shadow duration-300">
      <h3 className="font-bold text-gray-800 mb-4">Truy cập nhanh</h3>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`${item.color} text-white rounded-xl p-4 md:p-5 flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-lg transform hover:scale-110 active:scale-95`}
          >
            <div className="opacity-90">{item.icon}</div>
            <span className="text-xs md:text-sm font-semibold text-center leading-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
