import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { ArrowLeft, Send, Plus, Edit2, Trash2, CheckCircle2, Circle, Play, Pause, RotateCcw, Music } from 'lucide-react'
import axiosClient from '@/config/axiosClient'


interface TodoItem {
  id: number
  text: string
  completed: boolean
}

interface Note {
  id: number
  content: string
  createdAt: string
}

interface ChatMessage {
  id: string
  user: string
  text: string
  timestamp: string
}

interface MusicTrack {
  id: number
  title: string
  artist: string
  category: string
  spotifyUrl?: string
  youtubeUrl?: string
}

export default function StudySession() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { token, user } = useAuthStore()

  const [session, setSession] = useState<any>(location.state?.session || null)
  const [loading, setLoading] = useState(true)
  const [chatTab, setChatTab] = useState<'discussion' | 'notes'>('discussion')
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)

  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isWorkTime, setIsWorkTime] = useState(true)
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodo, setNewTodo] = useState('')
  
  const [notes, setNotes] = useState<Note[]>([])
  const [noteContent, setNoteContent] = useState('')
  
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([])
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null)
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'Cấu Bé Tớ Mộ', text: 'Mọi người ơi, mình đang tìm hiểu về das. Có ai biết k?', timestamp: '4 giờ trước' }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [pomodorosCount, setPomodorosCount] = useState(0)

  // Check authentication
  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
    }
  }, [token, user, navigate])

  // Load session data
  useEffect(() => {
    if (!sessionId || !token) return

    const loadSessionData = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get(`/api/sessions/${sessionId}`)
        const data = response.data
        
        setSession(data.session)
        setTodos(data.todos || [])
        setNotes(data.notes || [])
        setSelectedMusic(data.session.backgroundMusic || null)
        
        // Initialize timer
        setTimeLeft((data.session.workDuration || 25) * 60)
      } catch (error) {
        console.error('Error loading session:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSessionData()
  }, [sessionId, token])

  // Load music tracks
  useEffect(() => {
    const loadMusicTracks = async () => {
      try {
        const response = await axiosClient.get('/api/music')
        setMusicTracks(response.data || [])
      } catch (error) {
        console.error('Error loading music:', error)
      }
    }

    loadMusicTracks()
  }, [token])

  // Pomodoro timer
  useEffect(() => {
    if (!isRunning || !session) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Switch to next phase
          const nextIsWorkTime = !isWorkTime
          setIsWorkTime(nextIsWorkTime)
          
          if (!nextIsWorkTime) {
            setPomodorosCount(pomodorosCount + 1)
          }
          
          return nextIsWorkTime 
            ? (session.workDuration || 25) * 60 
            : (session.breakDuration || 5) * 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, isWorkTime, session, pomodorosCount])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Todo functions
  const addTodo = async () => {
    if (!newTodo.trim() || !session) return
    
    try {
      const response = await axiosClient.post(`/api/sessions/${session.id}/todos`, {
        text: newTodo
      })
      setTodos([...todos, response.data])
      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
      alert('Không thể thêm công việc')
    }
  }

  const toggleTodo = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return

      const response = await axiosClient.put(`/api/sessions/${session.id}/todos/${id}`, {
        completed: !todo.completed
      })
      
      setTodos(todos.map((t) => (t.id === id ? response.data : t)))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await axiosClient.delete(`/api/sessions/${session.id}/todos/${id}`)
      setTodos(todos.filter((t) => t.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
      alert('Không thể xóa công việc')
    }
  }

  // Note functions
  const saveNote = async () => {
    if (!noteContent.trim() || !session) return
    
    try {
      const response = await axiosClient.post(`/api/sessions/${session.id}/notes`, {
        content: noteContent
      })
      setNotes([...notes, response.data])
      setNoteContent('')
      alert('Ghi chú đã được lưu')
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Không thể lưu ghi chú')
    }
  }

  // Music functions
  const updateBackgroundMusic = async (musicId: string | null) => {
    if (!session) return
    
    try {
      await axiosClient.put(`/api/sessions/${session.id}/music`, {
        backgroundMusic: musicId || 'none'
      })
      setSelectedMusic(musicId)
      setSession({ ...session, backgroundMusic: musicId })
    } catch (error) {
      console.error('Error updating music:', error)
      alert('Không thể cập nhật nhạc')
    }
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

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-8">
          <div className="text-center">Đang tải dữ liệu...</div>
        </div>
      </Layout>
    )
  }

  if (!session) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-8">
          <div className="text-center">Không tìm thấy phiên học</div>
          <button
            onClick={() => navigate('/study')}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Quay lại
          </button>
        </div>
      </Layout>
    )
  }

  const completedTodos = todos.filter((t) => t.completed).length
  const selectedMusicTrack = musicTracks.find(m => m.id.toString() === selectedMusic)

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
                  🍅 {isWorkTime ? 'Thời gian tập trung' : 'Thời gian nghỉ'} - {pomodorosCount} pomodoros
                </p>
                <div className="text-6xl font-bold text-orange-600 font-mono my-6">
                  {formatTime(timeLeft)}
                </div>

                {/* Progress Circle */}
                <div className="w-32 h-32 rounded-full border-4 border-orange-200 flex items-center justify-center mx-auto mb-6 relative">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-orange-500"
                    style={{
                      clipPath: `polygon(50% 0%, 50% 50%, ${50 + 50 * Math.cos((timeLeft / (isWorkTime ? (session.workDuration || 25) * 60 : (session.breakDuration || 5) * 60) - 0.5) * Math.PI)}%, ${50 + 50 * Math.sin((timeLeft / (isWorkTime ? (session.workDuration || 25) * 60 : (session.breakDuration || 5) * 60) - 0.5) * Math.PI)}%)`,
                    }}
                  />
                  <span className="text-2xl font-bold text-orange-600">
                    {Math.round((1 - timeLeft / (isWorkTime ? (session.workDuration || 25) * 60 : (session.breakDuration || 5) * 60)) * 100)}%
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
                      setTimeLeft((session.workDuration || 25) * 60)
                      setIsWorkTime(true)
                      setPomodorosCount(0)
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
                <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                  <div className="flex-1 mb-4">
                    {notes.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-semibold text-gray-600">Các ghi chú đã lưu:</p>
                        {notes.map((note) => (
                          <div key={note.id} className="bg-yellow-50 p-2 rounded border border-yellow-200">
                            <p className="text-xs text-gray-700">{note.content}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(note.createdAt).toLocaleString('vi-VN')}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <textarea
                    placeholder="Ghi chú nhanh của bạn..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none mb-2"
                  />
                  <button
                    onClick={saveNote}
                    className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition"
                  >
                    Lưu ghi chú
                  </button>
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

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
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

              {selectedMusicTrack && (
                <>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      🎵 {selectedMusicTrack.title} - {selectedMusicTrack.artist}
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
                <p className="text-xs text-gray-600 font-semibold">Chọn nhạc:</p>
                <select
                  value={selectedMusic || ''}
                  onChange={(e) => updateBackgroundMusic(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Không có nhạc</option>
                  {musicTracks.map((track) => (
                    <option key={track.id} value={track.id.toString()}>
                      {track.title} - {track.artist} ({track.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
