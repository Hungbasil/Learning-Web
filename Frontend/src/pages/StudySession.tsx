import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { ArrowLeft, Send, Plus, Edit2, Trash2, CheckCircle2, Circle, Play, Pause, RotateCcw, Music, Settings, X, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { axiosClient } from '@/config/axiosClient'


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
  duration?: number
}

export default function StudySession() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { token, user } = useAuthStore()
  
  // Audio player reference
  const audioRef = useRef<HTMLAudioElement>(null)
  const sessionStartTimeRef = useRef<Date>(new Date())

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
  
  // Music player state
  const [volume, setVolume] = useState(50)
  const [showMusicSettings, setShowMusicSettings] = useState(false)
  const [shuffleMode, setShuffleMode] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [musicProgress, setMusicProgress] = useState(50)
  
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`chat_${sessionId}`)
    return saved ? JSON.parse(saved) : [{ id: '1', user: 'BOT', text: 'Trò chuyện ở đây', timestamp: '.' }]
  })
  const [newMessage, setNewMessage] = useState('')
  const [pomodorosCount, setPomodorosCount] = useState(() => {
    const saved = localStorage.getItem(`pomodoros_${sessionId}`)
    return saved ? parseInt(saved) : 0
  })

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
        const response = await axiosClient.get(`/sessions/${sessionId}`)
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
        const response = await axiosClient.get('/music')
        setMusicTracks(response.data || [])
      } catch (error) {
        console.error('Error loading music:', error)
      }
    }

    loadMusicTracks()
  }, [token])

  // Save pomodoros to localStorage
  useEffect(() => {
    localStorage.setItem(`pomodoros_${sessionId}`, pomodorosCount.toString())
  }, [pomodorosCount, sessionId])

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages))
  }, [messages, sessionId])

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

  // Audio playback synchronization
  useEffect(() => {
    if (!audioRef.current || !selectedMusicTrack) return

    if (isPlayingMusic) {
      audioRef.current.volume = volume / 100
      audioRef.current.play().catch(err => console.error('Lỗi phát nhạc:', err))
    } else {
      audioRef.current.pause()
    }
  }, [isPlayingMusic, volume])

  // Handle music progress update
  useEffect(() => {
    if (!audioRef.current) return

    const handleTimeUpdate = () => {
      if (audioRef.current && audioRef.current.duration) {
        const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
        setMusicProgress(progress)
      }
    }

    const handleEnded = () => {
      if (autoPlay && musicTracks.length > 1) {
        // Play next track if autoPlay enabled
        const currentIndex = musicTracks.findIndex(t => t.id.toString() === selectedMusic)
        if (currentIndex < musicTracks.length - 1) {
          updateBackgroundMusic(musicTracks[currentIndex + 1].id.toString())
        }
      } else {
        setIsPlayingMusic(false)
      }
    }

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
    audioRef.current.addEventListener('ended', handleEnded)

    return () => {
      audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate)
      audioRef.current?.removeEventListener('ended', handleEnded)
    }
  }, [autoPlay, musicTracks, selectedMusic])

  // Handle session completion and cleanup
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
      completeAndCleanupSession()
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User left the page, mark session as completed
        completeAndCleanupSession()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [session, pomodorosCount])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Complete session and schedule cleanup
  const completeAndCleanupSession = async () => {
    if (!session) return

    try {
      // Calculate actual duration
      const actualDuration = Math.floor((new Date().getTime() - sessionStartTimeRef.current.getTime()) / 1000 / 60)

      // Update session to completed
      await axiosClient.put(`/sessions/${session.id}/complete`, {
        actualDuration,
        pomodorosCompleted: pomodorosCount,
        xpEarned: Math.min(pomodorosCount * 10, 100),
        notesWritten: notes.length,
        tasksCompleted: todos.filter(t => t.completed).length
      })

      // Schedule deletion after 5 minutes
      setTimeout(async () => {
        try {
          await axiosClient.delete(`/sessions/${session.id}`)
          console.log('Session deleted after 5 minutes')
        } catch (error) {
          console.error('Error deleting session:', error)
        }
      }, 5 * 60 * 1000)

      // Pause music
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlayingMusic(false)
      }
    } catch (error) {
      console.error('Error completing session:', error)
    }
  }

  // Todo functions
  const addTodo = async () => {
    if (!newTodo.trim() || !session) return
    
    try {
      const response = await axiosClient.post(`/sessions/${session.id}/todos`, {
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

      const response = await axiosClient.put(`/sessions/${session.id}/todos/${id}`, {
        completed: !todo.completed
      })
      
      setTodos(todos.map((t) => (t.id === id ? response.data : t)))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await axiosClient.delete(`/sessions/${session.id}/todos/${id}`)
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
      const response = await axiosClient.post(`/sessions/${session.id}/notes`, {
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
      await axiosClient.put(`/sessions/${session.id}/music`, {
        backgroundMusic: musicId || 'none'
      })
      setSelectedMusic(musicId)
      setSession({ ...session, backgroundMusic: musicId })
      
      // Reset music progress and pause
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        setMusicProgress(0)
        setIsPlayingMusic(false)
      }
    } catch (error) {
      console.error('Error updating music:', error)
      alert('Không thể cập nhật nhạc')
    }
  }

  const seekMusic = (progress: number) => {
    if (audioRef.current && selectedMusicTrack) {
      audioRef.current.currentTime = (progress / 100) * (selectedMusicTrack.duration || 220)
      setMusicProgress(progress)
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
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Music className="w-5 h-5 text-orange-500" />
                  Nhạc học tập
                </h3>
                <button
                  onClick={() => setShowMusicSettings(!showMusicSettings)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Music Settings Modal */}
              {showMusicSettings && (
                <div className="p-4 border-b border-gray-200 bg-gray-50 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Cài đặt nhạc trung tâm</p>
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

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Phát ngầu nhiên</span>
                      <input
                        type="checkbox"
                        checked={shuffleMode}
                        onChange={(e) => setShuffleMode(e.target.checked)}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Tự động chuyên bài</span>
                      <input
                        type="checkbox"
                        checked={autoPlay}
                        onChange={(e) => setAutoPlay(e.target.checked)}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Âm lượng</span>
                      <span className="text-sm font-bold text-orange-600">{volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Now Playing */}
              {selectedMusicTrack && (
                <div className="p-4 space-y-3">
                  <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Đang phát</p>
                    <p className="font-bold text-gray-800 text-sm">{selectedMusicTrack.title}</p>
                    <p className="text-xs text-gray-600">{selectedMusicTrack.artist}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={musicProgress}
                      onChange={(e) => seekMusic(parseInt(e.target.value))}
                      className="w-full cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{Math.floor(musicProgress * 0.6)}s</span>
                      <span>3:40</span>
                    </div>
                  </div>

                  {/* Player Controls */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {}}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <SkipBack className="w-5 h-5 text-gray-600" />
                    </button>

                    <button
                      onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                      className={`p-3 rounded-lg transition ${
                        isPlayingMusic
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {isPlayingMusic ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() => {}}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <SkipForward className="w-5 h-5 text-gray-600" />
                    </button>

                    <div className="ml-auto flex items-center gap-1">
                      <Volume2 className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-bold text-orange-600 w-8">{volume}%</span>
                    </div>
                  </div>
                </div>
              )}

              {!selectedMusicTrack && (
                <div className="p-6 text-center">
                  <Music className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Chưa chọn nhạc</p>
                  <button
                    onClick={() => setShowMusicSettings(true)}
                    className="mt-3 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition"
                  >
                    Chọn nhạc
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hidden Audio Element for Music Playback */}
        {selectedMusicTrack && (
          <audio
            ref={audioRef}
            crossOrigin="anonymous"
            src={selectedMusicTrack.youtubeUrl || selectedMusicTrack.spotifyUrl || ''}
            onPlay={() => console.log('Music started playing')}
            onError={(e) => console.error('Error loading music:', e)}
          />
        )}
      </div>
    </Layout>
  )
}
