import { Activity } from 'lucide-react'

interface HeatmapDay {
  date: string
  count: number
}

export function HeatmapActivity() {
  const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

  // Sample data: Tạo một lưới với các ô ngẫu nhiên
  const generateHeatmapData = () => {
    const data: HeatmapDay[] = []
    const today = new Date()
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5),
      })
    }
    return data
  }

  const heatmapData = generateHeatmapData()

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100'
    if (count === 1) return 'bg-green-200'
    if (count === 2) return 'bg-green-400'
    if (count === 3) return 'bg-green-500'
    return 'bg-green-600'
  }

  // Tính toán để hiển thị 52 tuần gần đây
  const weeks = []
  const recentData = heatmapData.slice(-364)
  
  for (let i = 0; i < recentData.length; i += 7) {
    weeks.push(recentData.slice(i, i + 7))
  }

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Bản đồ hoạt động học tập</h2>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block">
          {/* Days of week labels */}
          <div className="flex gap-1 mb-2">
            <div className="w-10"></div>
            <div className="flex gap-0.5">
              {daysOfWeek.map((day) => (
                <div key={day} className="w-3 h-3 md:w-4 md:h-4 flex items-center justify-center text-xs text-gray-500">
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap weeks */}
          <div className="flex gap-1">
            <div className="flex flex-col gap-0.5">
              {months.slice(0, 6).map((month, idx) => (
                <div key={month} className="h-4 text-xs text-gray-500 leading-none pt-0.5">
                  {idx % 2 === 0 ? month : ''}
                </div>
              ))}
            </div>

            <div className="flex gap-0.5">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-0.5">
                  {week.map((day, dayIdx) => (
                    <div
                      key={`${weekIdx}-${dayIdx}`}
                      className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${getColor(day.count)} hover:ring-2 hover:ring-indigo-500 hover:ring-offset-1 transition-all duration-200 cursor-pointer transform hover:scale-125`}
                      title={`${day.date}: ${day.count} hoạt động`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
            <span>Ít</span>
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 ${getColor(level)} rounded-sm`}
                />
              ))}
            </div>
            <span>Nhiều</span>
          </div>
        </div>
      </div>
    </div>
  )
}
