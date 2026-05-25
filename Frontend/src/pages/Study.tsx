import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { Users, ArrowLeft, Plus, X, Clock, Zap, Flame, CheckCircle, Coffee, TrendingUp, BookOpen, Award } from 'lucide-react'
import { axiosClient } from '@/config/axiosClient'

interface StudySession {
  id: number
  title: string
  description: string
  relatedCourseId?: number
  workDuration: number
  breakDuration: number
  backgroundMusic?: string
  status: string
  startTime: string
  endTime?: string
  actualDuration?: number
  xpEarned?: number
  pomodorosCompleted?: number
  notesWritten?: number
  tasksCompleted?: number
}

interface StudyStats {
  totalStudyTime: number
  totalXpEarned: number
  currentStreak: number
  completedSessions: number
  totalSessions: number
  totalPomodoros: number
  completionRate: number
  averageSessionDuration: number
  totalNotesWritten: number
  totalTasksCompleted: number
}

export default function Study() {
  const { token, user } = useAuthStore()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState<'sessions' | 'history'>('sessions')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [stats, setStats] = useState<StudyStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [timePeriod, setTimePeriod] = useState(30)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    relatedCourseId: '',
    workDuration: 25,
    breakDuration: 5,
    backgroundMusic: 'none',
  })
  const [pomodoroPreset, setPomodoroPreset] = useState('classic')

  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
      return
    }
    
    fetchSessions()
    fetchStats()
  }, [token, user, navigate, timePeriod])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/sessions/history')
      setSessions(response.data)
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axiosClient.get(`/sessions/stats?days=${timePeriod}`)
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleCreateSession = async () => {
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề phiên')
      return
    }

    try {
      const response = await axiosClient.post('/sessions', {
        title: formData.title,
        description: formData.description,
        relatedCourseId: formData.relatedCourseId || null,
        workDuration: formData.workDuration,
        breakDuration: formData.breakDuration,
        backgroundMusic: formData.backgroundMusic,
      })

      setShowCreateModal(false)
      setFormData({
        title: '',
        description: '',
        relatedCourseId: '',
        workDuration: 25,
        breakDuration: 5,
        backgroundMusic: 'none',
      })
      setPomodoroPreset('classic')
      
      // Navigate to study session
      navigate(`/study-session/${response.data.id}`, { state: { session: response.data } })
    } catch (error) {
      console.error('Failed to create session:', error)
      alert('Không thể tạo phiên học')
    }
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
          <p className="text-gray-600 mt-2">Quản lý phiên học và theo dõi tiến độ của bạn</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === 'sessions'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Phiên Học
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === 'history'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Lịch Sử Học Tập
          </button>
        </div>

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <>
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

            {/* Sessions List */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Đang tải phiên học...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Bạn chưa có phiên học nào. Bắt đầu phiên học đầu tiên!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => navigate(`/study-session/${session.id}`, { state: { session } })}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg mb-1">{session.title}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(session.startTime).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        session.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {session.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang học'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {session.description || 'Không có mô tả'}
                    </p>

                    <div className="space-y-2 mb-4 pb-4 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <span>Làm việc: {session.workDuration} phút</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Coffee className="w-4 h-4 text-blue-600" />
                        <span>Nghỉ: {session.breakDuration} phút</span>
                      </div>
                      {session.actualDuration && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span>Thời gian thực tế: {session.actualDuration} phút</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      {session.xpEarned && (
                        <span className="text-sm font-semibold text-orange-600">
                          +{session.xpEarned} XP
                        </span>
                      )}
                      <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                        Chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <>
            {/* Time Period Filter */}
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Clock className="w-6 h-6 text-indigo-600" />
                Lịch Sử Học Tập
              </h2>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(parseInt(e.target.value))}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value={7}>7 ngày qua</option>
                <option value={14}>14 ngày qua</option>
                <option value={30}>30 ngày qua</option>
                <option value={90}>90 ngày qua</option>
                <option value={365}>1 năm qua</option>
              </select>
            </div>

            {/* Stats Grid */}
            {stats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Total Study Time */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-600">Tổng thời gian học tập</span>
                      <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalStudyTime}</p>
                    <p className="text-xs text-gray-500 mt-1">phút</p>
                  </div>

                  {/* Total XP */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-600">Tổng XP</span>
                      <Zap className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalXpEarned}</p>
                    <p className="text-xs text-gray-500 mt-1">điểm</p>
                  </div>

                  {/* Current Streak */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-600">Chuỗi hiện tại</span>
                      <Flame className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.currentStreak}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.currentStreak === 1 ? 'Đại nhất: 0 ngày' : 'Đại nhất: ' + stats.currentStreak + ' ngày'}
                    </p>
                  </div>

                  {/* Completed Sessions */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-600">Phiên đã hoàn thành</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.completedSessions}</p>
                    <p className="text-xs text-gray-500 mt-1">Đã tạo: {stats.totalSessions}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Pomodoros */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-600">Tổng Pomodoros</span>
                      <Coffee className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalPomodoros}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Trung bình mỗi phiên: {stats.completedSessions > 0 ? (stats.totalPomodoros / stats.completedSessions).toFixed(1) : 0}
                    </p>
                  </div>

                  {/* Completion Rate */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-600">Tỷ lệ hoàn thành</span>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.completionRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 mt-1">Thời lượng TBB: {stats.averageSessionDuration.toFixed(0)} phút</p>
                  </div>

                  {/* Notes Written */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-600">Ghi chú đã viết</span>
                      <BookOpen className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalNotesWritten}</p>
                    <p className="text-xs text-gray-500 mt-1">0 kỹ năng</p>
                  </div>

                  {/* Tasks Completed */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-600">Công việc hoàn thành</span>
                      <Award className="w-5 h-5 text-indigo-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalTasksCompleted}/0</p>
                    <p className="text-xs text-gray-500 mt-1">Chưa có task</p>
                  </div>
                </div>

                {/* Additional sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* XP Analysis */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Phân tích XP
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Nguồn XP</span>
                        <span className="font-semibold text-gray-800">{stats.totalXpEarned}</span>
                      </div>
                      {stats.totalXpEarned > 0 && (
                        <>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                          <p className="text-xs text-gray-500">Từ phiên học</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-500" />
                      Điểm Nổi Bật
                    </h3>
                    {stats.currentStreak > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                        <Flame className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-red-700">
                          Bạn có chuỗi {stats.currentStreak} ngày!
                        </span>
                      </div>
                    )}
                    {stats.totalXpEarned > 100 && (
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg mt-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-yellow-700">
                          Bạn đã kiếm được {stats.totalXpEarned} XP!
                        </span>
                      </div>
                    )}
                    {stats.completionRate === 100 && stats.completedSessions > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg mt-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-700">
                          Bạn hoàn thành tất cả phiên!
                        </span>
                      </div>
                    )}
                    {stats.currentStreak === 0 && stats.totalXpEarned === 0 && (
                      <p className="text-sm text-gray-500">Chưa có điểm nổi bật. Hãy bắt đầu học ngay!</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Đang tải thống kê...</p>
              </div>
            )}
          </>
        )}


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

              {/* Khóa học liên quan */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Khóa học liên quan (Tùy chọn)</label>
                <input
                  type="number"
                  placeholder="ID khóa học"
                  value={formData.relatedCourseId}
                  onChange={(e) => setFormData({ ...formData, relatedCourseId: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Cài đặt Pomodoro */}
              <div className="border-t-2 border-b-2 border-gray-200 py-6">
                <h3 className="font-bold text-gray-800 mb-2">🍅 Cài đặt đồng hồ Pomodoro</h3>
                <p className="text-sm text-gray-600 mb-4">Mẫu có sẵn</p>
                
                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {[
                    { key: 'classic', label: 'Cổ điển (25/5)', duration: 25, break: 5 },
                    { key: 'short', label: 'Ngắn (15/5)', duration: 15, break: 5 },
                    { key: 'long', label: 'Dài (50/10)', duration: 50, break: 10 },
                    { key: 'custom', label: 'Tùy chỉnh', duration: null, break: null }
                  ].map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => {
                        setPomodoroPreset(preset.key)
                        if (preset.duration !== null) {
                          setFormData({
                            ...formData,
                            workDuration: preset.duration,
                            breakDuration: preset.break
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      <span className="text-orange-600">*</span> Làm việc (phút)
                    </label>
                    <input
                      type="number"
                      value={formData.workDuration}
                      onChange={(e) => setFormData({ ...formData, workDuration: parseInt(e.target.value) })}
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
                      value={formData.breakDuration}
                      onChange={(e) => setFormData({ ...formData, breakDuration: parseInt(e.target.value) })}
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

              {/* Nhạc nền */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Nhạc nền (Tùy chọn)</label>
                <select
                  value={formData.backgroundMusic}
                  onChange={(e) => setFormData({ ...formData, backgroundMusic: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option value="none">Không có nhạc</option>
                  <option value="lofi">Lo-fi</option>
                  <option value="classical">Nhạc cổ điển</option>
                  <option value="ambient">Âm thanh xung quanh</option>
                  <option value="nature">Âm thanh tự nhiên</option>
                </select>
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
      </div>
    </Layout>
  )
}
