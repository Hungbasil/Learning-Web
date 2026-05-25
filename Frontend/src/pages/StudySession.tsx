import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { ArrowLeft, Send, Plus, Edit2, Trash2, CheckCircle2, Circle, Play, Pause, RotateCcw, Music } from 'lucide-react'

interface TodoItem {
  id: string
  text: string
  completed: boolean
}

interface ChatMessage {
  id: string
  user: string
  text: string
  timestamp: string
}

export default function StudySession() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { token, user } = useAuthStore()

  const [session, setSession] = useState<any>(location.state?.session || {
    title: 'Phiên học React',
    description: 'Cùng học React Hooks',
    topic: 'Lập trình',
    subject: 'React Hooks',
    pomodoroDuration: 25,
    pomodoroBreak: 5,
    longBreakDuration: 15,
    maxParticipants: 50,
  })

  const [chatTab, setChatTab] = useState<'discussion' | 'notes'>('discussion')
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)

  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(session.pomodoroDuration * 60)
  const [isWorkTime, setIsWorkTime] = useState(true)
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'Cấu Bé Tớ Mộ', text: 'Mọi người ơi, mình đang tìm hiểu về das. Có ai biết k?', timestamp: '4 giờ trước' }
  ])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
    }
  }, [token, user, navigate])

  // Pomodoro timer
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsWorkTime(!isWorkTime)
          return isWorkTime ? session.pomodoroBreak * 60 : session.pomodoroDuration * 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, isWorkTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const addTodo = () => {
    if (!newTodo.trim()) return
    setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }])
    setNewTodo('')
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id))
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        user: user?.fullName || 'Tôi',
        text: newMessage,
        timestamp: 'vừa xong',
      }
    ])
    setNewMessage('')
  }

  if (!token || !user) {
    return null
  }

  const completedTodos = todos.filter((t) => t.completed).length

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/study')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        {/* Session Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{session.title}</h1>
              <p className="text-gray-600 mt-2">
                <span className="inline-block mr-4">👤 {user?.fullName}</span>
                <span className="inline-block mr-4 text-green-600">🟢 Đang hoạt động</span>
              </p>
              {/* Session Details */}
              <div className="mt-3 flex gap-4 text-sm text-gray-600">
                {session.topic && (
                  <span>📚 Chủ đề: <strong>{session.topic}</strong></span>
                )}
                {session.subject && (
                  <span>🎓 Môn: <strong>{session.subject}</strong></span>
                )}
              </div>
            </div>
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600 mb-1">Thành viên tham gia</p>
              <p className="text-2xl font-bold text-indigo-600">2 / {session.maxParticipants || 50}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pomodoro Timer */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-8">
              <div className="text-center">
                <p className="text-sm font-bold text-gray-700 mb-2">
                  🍅 {isWorkTime ? 'Thời gian tập trung' : 'Thời gian nghỉ'}
                </p>
                <div className="text-6xl font-bold text-orange-600 font-mono my-6">
                  {formatTime(timeLeft)}
                </div>

                {/* Progress Circle */}
                <div className="w-32 h-32 rounded-full border-4 border-orange-200 flex items-center justify-center mx-auto mb-6 relative">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-orange-500"
                    style={{
                      clipPath: `polygon(50% 0%, 50% 50%, ${50 + 50 * Math.cos((timeLeft / (isWorkTime ? session.pomodoroDuration * 60 : session.pomodoroBreak * 60) - 0.5) * Math.PI)}%, ${50 + 50 * Math.sin((timeLeft / (isWorkTime ? session.pomodoroDuration * 60 : session.pomodoroBreak * 60) - 0.5) * Math.PI)}%)`,
                    }}
                  />
                  <span className="text-2xl font-bold text-orange-600">
                    {Math.round((1 - timeLeft / (isWorkTime ? session.pomodoroDuration * 60 : session.pomodoroBreak * 60)) * 100)}%
                  </span>
                </div>

                {/* Controls */}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg flex items-center gap-2 transition"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-5 h-5" /> Tạm dừng
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" /> Bắt đầu
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsRunning(false)
                      setTimeLeft(session.pomodoroDuration * 60)
                      setIsWorkTime(true)
                    }}
                    className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg flex items-center gap-2 transition"
                  >
                    <RotateCcw className="w-5 h-5" /> Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden flex flex-col h-96">
              {/* Chat Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => setChatTab('discussion')}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                    chatTab === 'discussion'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  💬 Thảo luận
                </button>
                <button
                  onClick={() => setChatTab('notes')}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                    chatTab === 'notes'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  🗒️ Ghi chú nhập nhanh
                </button>
              </div>

              {/* Chat Content */}
              {chatTab === 'discussion' ? (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="bg-blue-50 rounded-lg p-3">
                        <p className="font-bold text-gray-800 text-sm">{msg.user}</p>
                        <p className="text-gray-700 text-sm mt-1">{msg.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập tin nhắn..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 overflow-y-auto p-4">
                  <textarea
                    placeholder="Ghi chú nhanh của bạn..."
                    className="w-full h-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                    defaultValue="- Học xong section Hooks&#10;- Cần ôn tập lại useEffect"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Danh sách công việc */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">📋 Danh sách công việc</h3>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                  {completedTodos} / {todos.length}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {todos.map((todo) => (
                  <div key={todo.id} className="flex items-center gap-2 group">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="flex-shrink-0 transition"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
                      )}
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Thêm công việc..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={addTodo}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Nhạc học tập */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Music className="w-5 h-5 text-orange-500" />
                  Nhạc học tập
                </h3>
              </div>

              {session.backgroundMusic && session.backgroundMusic !== 'none' && (
                <>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      {session.backgroundMusic === 'lofi' && '🎵 Lo-fi'}
                      {session.backgroundMusic === 'classical' && '🎻 Nhạc cổ điển'}
                      {session.backgroundMusic === 'ambient' && '🌊 Âm thanh xung quanh'}
                      {session.backgroundMusic === 'nature' && '🌿 Âm thanh tự nhiên'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition ${
                          isPlayingMusic
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {isPlayingMusic ? '⏸️ Dừng' : '▶️ Phát'}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="50"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <p className="text-xs text-gray-600 font-semibold">Chế độ khác</p>
                <button className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg transition border border-gray-200">
                  🎵 Danh sách phát Spotify
                </button>
              </div>
            </div>

            {/* Ghi chú nhân */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-4">
              <h3 className="font-bold text-gray-800 mb-3">🗒️ Ghi chú nhân</h3>
              <textarea
                placeholder="Ghi chú của bạn..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                rows={6}
              />
              <button className="w-full mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition">
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
