import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { Briefcase, ArrowLeft, Filter } from 'lucide-react'
import {axiosClient} from '@/config/axiosClient'

interface Interview {
  id: number
  title: string
  role: string
  field: string
  description: string
  durationMinutes: number
  totalQuestions: number
  passingScore: number
  xpReward: number
  difficulty: string
}

export default function Interview() {
  const { token, user } = useAuthStore()
  const navigate = useNavigate()
  
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [selectedField, setSelectedField] = useState<string>('')
  const [showRoleFilter, setShowRoleFilter] = useState(false)
  const [showFieldFilter, setShowFieldFilter] = useState(false)
  
  const roles = ['Junior', 'Mid-Level', 'Senior']
  const fields = ['iOS', 'Android', 'Frontend', 'Backend', 'Full Stack']

  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
    }
  }, [token, user, navigate])

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (selectedRole) params.append('role', selectedRole)
        if (selectedField) params.append('field', selectedField)
        
        const response = await axiosClient.get(
          `/api/interviews${params.toString() ? '?' + params.toString() : ''}`
        )
        setInterviews(response.data)
        setFilteredInterviews(response.data)
      } catch (error) {
        console.error('Lỗi khi tải danh sách phỏng vấn:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchInterviews()
  }, [selectedRole, selectedField])

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
            <Briefcase className="w-7 h-7 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Phòng Phỏng Vấn</h1>
          </div>
          <p className="text-gray-600 mt-2">Luyện tập phỏng vấn xin việc với hệ thống giả lập</p>
        </div>

        {/* Filter Section */}
        <div className="mb-6 flex flex-wrap gap-3">
          {/* Role Filter */}
          <div className="relative">
            <button
              onClick={() => setShowRoleFilter(!showRoleFilter)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Vai trò: {selectedRole || 'Tất cả'}
            </button>
            {showRoleFilter && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-max">
                <button
                  onClick={() => {
                    setSelectedRole('')
                    setShowRoleFilter(false)
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Tất cả
                </button>
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setSelectedRole(role)
                      setShowRoleFilter(false)
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Field Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFieldFilter(!showFieldFilter)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Lĩnh vực: {selectedField || 'Tất cả'}
            </button>
            {showFieldFilter && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-max">
                <button
                  onClick={() => {
                    setSelectedField('')
                    setShowFieldFilter(false)
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Tất cả
                </button>
                {fields.map((field) => (
                  <button
                    key={field}
                    onClick={() => {
                      setSelectedField(field)
                      setShowFieldFilter(false)
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {field}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Interview Sessions Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không tìm thấy phỏng vấn nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/interview/${interview.id}`)}
              >
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 h-40 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all">
                  <Briefcase className="w-12 h-12 text-indigo-600 opacity-50" />
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-2">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {interview.role}
                    </span>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      {interview.field}
                    </span>
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                      {interview.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{interview.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{interview.description}</p>
                  
                  <div className="flex gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{interview.durationMinutes} phút</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>❓</span>
                      <span>{interview.totalQuestions} câu</span>
                    </div>
                  </div>
                  
                  <button className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    Bắt đầu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

