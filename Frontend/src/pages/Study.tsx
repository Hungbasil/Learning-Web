import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { Users, ArrowLeft, Plus, X } from 'lucide-react'

interface StudySession {
  id: string
  title: string
  description: string
  topic: string
  subject: string
  duration: number
  maxParticipants: number
  pomodoroDuration: number
  pomodoroBreak: number
  pomodoroLongBreak: number
}

export default function Study() {
  const { token, user } = useAuthStore()
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topic: '',
    subject: '',
    duration: 120,
    maxParticipants: 50,
    pomodoroDuration: 25,
    pomodoroBreak: 5,
    pomodoroLongBreak: 15,
  })
  const [pomodoroPreset, setPomodoroPreset] = useState('classic')

  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
    }
  }, [token, user, navigate])

  const handleCreateSession = () => {
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề phiên')
      return
    }
    // Tạo session ID giả
    const sessionId = `session_${Date.now()}`
    // Navigate đến trang phiên học
    navigate(`/study-session/${sessionId}`, { state: { session: formData } })
  }

  if (!token || !user) {
    return null
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <div className="flex items-center gap-3">
            <Users className="w-7 h-7 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Học Cùng Tôi</h1>
          </div>
          <p className="text-gray-600 mt-2">Tham gia nhóm học tập cùng những học viên khác</p>
        </div>

        {/* Create Buttons */}
        <div className="mb-8 flex gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Bắt đầu Phiên
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
            <Plus className="w-5 h-5" />
            Tạo Nhóm Học
          </button>
        </div>

        {/* Study Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  {item}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Nhóm Học {item}</h3>
                  <p className="text-xs text-gray-500">{5 + item} thành viên</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Nhóm học tập cho môn Lập trình Python
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">Hoạt động hôm nay</span>
                <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                  Tham gia
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tạo Phiên Học */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-800">Tạo phiên học</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Tiêu đề */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  <span className="text-orange-600">*</span> Tiêu đề phiên
                </label>
                <input
                  type="text"
                  placeholder="vd: Cùng học React nào!"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Mô tả (Tùy chọn)
                </label>
                <textarea
                  placeholder="Mô tả nội dung bạn sẽ học trong phiên này..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Chủ đề & Môn học */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Chủ đề (Tùy chọn)</label>
                  <input
                    type="text"
                    placeholder="vd: Lập trình"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Môn học (Tùy chọn)</label>
                  <input
                    type="text"
                    placeholder="vd: React Hooks"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Cài đặt Pomodoro */}
              <div className="border-t-2 border-b-2 border-gray-200 py-6">
                <h3 className="font-bold text-gray-800 mb-2">🍅 Cài đặt đồng hộ Pomodoro</h3>
                <p className="text-sm text-gray-600 mb-4">Mẫu có sẵn</p>
                
                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {[
                    { key: 'classic', label: 'Cổ điển (25/15/15)', duration: 25, break: 5, longBreak: 15 },
                    { key: 'short', label: 'Ngắn (15/5/10)', duration: 15, break: 5, longBreak: 10 },
                    { key: 'long', label: 'Dài (50/10/20)', duration: 50, break: 10, longBreak: 20 },
                    { key: 'custom', label: 'Tùy chỉnh', duration: null, break: null, longBreak: null }
                  ].map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => {
                        setPomodoroPreset(preset.key)
                        if (preset.duration !== null) {
                          setFormData({
                            ...formData,
                            pomodoroDuration: preset.duration,
                            pomodoroBreak: preset.break,
                            pomodoroLongBreak: preset.longBreak
                          })
                        }
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition whitespace-nowrap ${
                        pomodoroPreset === preset.key
                          ? 'bg-orange-500 text-white'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      <span className="text-orange-600">*</span> Làm việc (phút)
                    </label>
                    <input
                      type="number"
                      value={formData.pomodoroDuration}
                      onChange={(e) => setFormData({ ...formData, pomodoroDuration: parseInt(e.target.value) })}
                      disabled={pomodoroPreset !== 'custom'}
                      className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none bg-gray-50 ${
                        pomodoroPreset !== 'custom'
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                          : 'border-gray-200 focus:border-orange-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      <span className="text-orange-600">*</span> Nghỉ ngắn (phút)
                    </label>
                    <input
                      type="number"
                      value={formData.pomodoroBreak}
                      onChange={(e) => setFormData({ ...formData, pomodoroBreak: parseInt(e.target.value) })}
                      disabled={pomodoroPreset !== 'custom'}
                      className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none bg-gray-50 ${
                        pomodoroPreset !== 'custom'
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                          : 'border-gray-200 focus:border-orange-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      <span className="text-orange-600">*</span> Nghỉ dài (phút)
                    </label>
                    <input
                      type="number"
                      value={formData.pomodoroLongBreak}
                      onChange={(e) => setFormData({ ...formData, pomodoroLongBreak: parseInt(e.target.value) })}
                      disabled={pomodoroPreset !== 'custom'}
                      className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none bg-gray-50 ${
                        pomodoroPreset !== 'custom'
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                          : 'border-gray-200 focus:border-orange-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Cài đặt phiên */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Cài đặt phiên</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      <span className="text-orange-600">*</span> Thời lượng (phút)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      <span className="text-orange-600">*</span> Số người tối đa
                    </label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end sticky bottom-0 bg-white z-10">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateSession}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition"
              >
                Tạo phiên
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
