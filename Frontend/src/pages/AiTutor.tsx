import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { Bot, ArrowLeft, Check, X, Zap, AlertCircle, Search, Globe, Code2, Smartphone, Database, Cloud, Server, Package, Sun, Coffee, Moon, Star, Download, Eye } from 'lucide-react'
import { axiosClient } from '@/config/axiosClient'

// ============ TYPES ============

type Step = 'language' | 'level' | 'goal' | 'time' | 'generating' | 'success'
type LanguageCategory = 'popular' | 'frontend' | 'backend' | 'mobile' | 'data' | 'devops' | 'database' | 'other'

interface LearningPathRequest {
  targetLanguage: string
  currentLevel: string
  studyGoal: string
  hoursPerWeek: string
}

interface LanguageItem {
  id: string
  name: string
  icon: string
  category: LanguageCategory
}

// ============ DATA CONSTANTS ============

const LANGUAGE_DATA: LanguageItem[] = [
  // Popular
  { id: 'javascript', name: 'JavaScript', icon: '🔥', category: 'popular' },
  { id: 'python', name: 'Python', icon: '🔥', category: 'popular' },
  { id: 'java', name: 'Java', icon: '🔥', category: 'popular' },
  { id: 'typescript', name: 'TypeScript', icon: '🔥', category: 'popular' },

  // Frontend
  { id: 'react', name: 'React', icon: '🌍', category: 'frontend' },
  { id: 'vue', name: 'Vue.js', icon: '🌍', category: 'frontend' },
  { id: 'angular', name: 'Angular', icon: '🌍', category: 'frontend' },
  { id: 'svelte', name: 'Svelte', icon: '🌍', category: 'frontend' },
  { id: 'nextjs', name: 'Next.js', icon: '🌍', category: 'frontend' },
  { id: 'nuxt', name: 'Nuxt.js', icon: '🌍', category: 'frontend' },

  // Backend
  { id: 'nodejs', name: 'Node.js', icon: '⚙️', category: 'backend' },
  { id: 'django', name: 'Django', icon: '⚙️', category: 'backend' },
  { id: 'flask', name: 'Flask', icon: '⚙️', category: 'backend' },
  { id: 'fastapi', name: 'FastAPI', icon: '⚙️', category: 'backend' },
  { id: 'spring', name: 'Spring Boot', icon: '⚙️', category: 'backend' },
  { id: 'laravel', name: 'Laravel', icon: '⚙️', category: 'backend' },
  { id: 'rails', name: 'Ruby on Rails', icon: '⚙️', category: 'backend' },
  { id: 'express', name: 'Express.js', icon: '⚙️', category: 'backend' },
  { id: 'nestjs', name: 'NestJS', icon: '⚙️', category: 'backend' },
  { id: 'dotnet', name: 'ASP.NET', icon: '⚙️', category: 'backend' },

  // Mobile
  { id: 'react-native', name: 'React Native', icon: '📱', category: 'mobile' },
  { id: 'flutter', name: 'Flutter', icon: '📱', category: 'mobile' },
  { id: 'swift', name: 'Swift', icon: '📱', category: 'mobile' },
  { id: 'kotlin', name: 'Kotlin', icon: '📱', category: 'mobile' },

  // Data & AI
  { id: 'tensorflow', name: 'TensorFlow', icon: '🤖', category: 'data' },
  { id: 'pytorch', name: 'PyTorch', icon: '🤖', category: 'data' },
  { id: 'pandas', name: 'Pandas', icon: '🤖', category: 'data' },
  { id: 'scikit', name: 'Scikit-learn', icon: '🤖', category: 'data' },

  // DevOps
  { id: 'docker', name: 'Docker', icon: '☁️', category: 'devops' },
  { id: 'kubernetes', name: 'Kubernetes', icon: '☁️', category: 'devops' },
  { id: 'jenkins', name: 'Jenkins', icon: '☁️', category: 'devops' },
  { id: 'terraform', name: 'Terraform', icon: '☁️', category: 'devops' },

  // Database
  { id: 'postgresql', name: 'PostgreSQL', icon: '🗄️', category: 'database' },
  { id: 'mysql', name: 'MySQL', icon: '🗄️', category: 'database' },
  { id: 'mongodb', name: 'MongoDB', icon: '🗄️', category: 'database' },
  { id: 'redis', name: 'Redis', icon: '🗄️', category: 'database' },

  // Other
  { id: 'c', name: 'C', icon: '📝', category: 'other' },
  { id: 'cpp', name: 'C++', icon: '📝', category: 'other' },
  { id: 'go', name: 'Go', icon: '📝', category: 'other' },
  { id: 'rust', name: 'Rust', icon: '📝', category: 'other' },
  { id: 'php', name: 'PHP', icon: '📝', category: 'other' },
  { id: 'csharp', name: 'C#', icon: '📝', category: 'other' },
  { id: 'ruby', name: 'Ruby', icon: '📝', category: 'other' },
]

const CATEGORY_INFO: Record<LanguageCategory, { label: string; icon: React.ReactNode; color: string }> = {
  popular: { label: 'Popular', icon: '🔥', color: 'text-red-500' },
  frontend: { label: 'Frontend', icon: '🌍', color: 'text-blue-500' },
  backend: { label: 'Backend', icon: '⚙️', color: 'text-orange-500' },
  mobile: { label: 'Mobile', icon: '📱', color: 'text-green-500' },
  data: { label: 'Data & AI', icon: '🤖', color: 'text-purple-500' },
  devops: { label: 'DevOps', icon: '☁️', color: 'text-cyan-500' },
  database: { label: 'Database', icon: '🗄️', color: 'text-pink-500' },
  other: { label: 'Other', icon: '📝', color: 'text-gray-500' },
}

const LEVELS = [
  { id: 'beginner', label: 'Mới bắt đầu', desc: 'Mới bắt đầu, chưa có kinh nghiệm' },
  { id: 'intermediate', label: 'Trung cấp', desc: 'Có kinh nghiệm, hiểu cơ bản' },
  { id: 'advanced', label: 'Nâng cao', desc: 'Nên tăng vừng, sản sáng nâng cao' },
]

const GOALS = [
  { id: 'job', icon: '💼', label: 'Xin việc làm developer', desc: 'Xin việc làm developer đầu tiên' },
  { id: 'skill', icon: '⚡', label: 'Trung cấp', desc: 'Có kinh nghiệm, hiểu cơ bản' },
  { id: 'upgrade', icon: '🏆', label: 'Nâng cao', desc: 'Nên tăng vừng, sản sáng nâng cao' },
  { id: 'freelance', icon: '💻', label: 'Học DevOps và quản lý hệ thống', desc: 'Hệ thống & triển khai hệ thống' },
  { id: 'qa', icon: '🚀', label: 'Xây dựng ứng dụng web fullstack', desc: 'Ứng dụng iOS & Android' },
  { id: 'ba', icon: '🛠️', label: 'Nâng cao kỹ năng lập trình', desc: 'Nâng cao kỹ năng lập trình' },
  { id: 'custom', icon: '✏️', label: 'Mục tiêu tùy chỉnh', desc: 'Viết mục tiêu của riêng bạn' },
]

const HOURS_PER_WEEK = [
  { id: '3', label: '3 giờ/tuần (Thoải mái)' },
  { id: '5', label: '5 giờ/tuần (Bản thông gian)' },
  { id: '10', label: '10 giờ/tuần (Thường xuyên)' },
  { id: '15', label: '15 giờ/tuần (Chuyên cần)' },
  { id: '20', label: '20 giờ/tuần (Tích cực)' },
  { id: '30', label: '30 giờ/tuần (Toàn thời gian)' },
  { id: '40', label: '40+ giờ/tuần (Chuyên sâu)' },
]

// ============ COMPONENTS ============

function Step1Language({
  selected,
  onSelect,
}: {
  selected: string | null
  onSelect: (value: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<LanguageCategory>('popular')

  const categories: LanguageCategory[] = ['popular', 'frontend', 'backend', 'mobile', 'data', 'devops', 'database', 'other']
  
  const filteredLanguages = LANGUAGE_DATA.filter((lang) => {
    const matchesSearch = lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'popular' ? lang.category === 'popular' : lang.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6">Bạn muốn học gì?</h3>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search languages, frameworks, tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex justify-between w-full mb-6 overflow-x-auto pb-0 border-b border-gray-100 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categories.map((category) => {
          const info = CATEGORY_INFO[category]
          const isActive = activeCategory === category
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex items-center gap-1.5 px-1 md:px-2 pb-3 text-[13px] md:text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <span className="text-base">{info.icon}</span>
              {info.label}
            </button>
          )
        })}
      </div>

      {/* Languages Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredLanguages.length > 0 ? (
          filteredLanguages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onSelect(lang.name)}
              className={`p-4 rounded-lg border-2 font-medium transition-all ${
                selected === lang.name
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
              }`}
            >
              <div className="text-2xl mb-2">{lang.icon}</div>
              <div className="text-sm">{lang.name}</div>
            </button>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Không tìm thấy kết quả cho "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Step2Level({
  selected,
  onSelect
}: {
  selected: string | null
  onSelect: (value: string) => void
}) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6">Trình độ hiện tại của bạn</h3>
      <div className="space-y-3">
        {LEVELS.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              selected === level.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-indigo-300'
            }`}
          >
            <h4 className={`font-semibold ${selected === level.id ? 'text-indigo-600' : 'text-gray-800'}`}>
              {level.label}
            </h4>
            <p className="text-sm text-gray-600 mt-1">{level.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function Step3Goal({
  selected,
  customGoal,
  onSelect,
  onCustomChange,
  showCustomInput
}: {
  selected: string | null
  customGoal: string
  onSelect: (value: string) => void
  onCustomChange: (value: string) => void
  showCustomInput: boolean
}) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6">Mục tiêu của bạn là gì?</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {GOALS.map((goal) => (
          <button
            key={goal.id}
            onClick={() => onSelect(goal.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selected === goal.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-indigo-300'
            }`}
          >
            <div className="text-2xl mb-2">{goal.icon}</div>
            <h4 className={`font-semibold ${selected === goal.id ? 'text-indigo-600' : 'text-gray-800'}`}>
              {goal.label}
            </h4>
            <p className="text-sm text-gray-600 mt-1">{goal.desc}</p>
          </button>
        ))}
      </div>

      {showCustomInput && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nhập mục tiêu tùy chỉnh</label>
          <textarea
            value={customGoal}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="Mô tả chi tiết mục tiêu học tập của bạn..."
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            rows={4}
          />
        </div>
      )}
    </div>
  )
}

function Step4Time({
  selected,
  onSelect
}: {
  selected: string | null
  onSelect: (value: string) => void
}) {
  const [preferredTimes, setPreferredTimes] = useState<Set<string>>(new Set(['morning']))
  
  const timeSlots = [
    { id: 'morning', label: 'Sáng', subLabel: '6AM - 12PM', icon: Sun, color: 'text-yellow-500' },
    { id: 'afternoon', label: 'Chiều', subLabel: '12PM - 5PM', icon: Coffee, color: 'text-orange-500' },
    { id: 'evening', label: 'Tối', subLabel: '5PM - 9PM', icon: Moon, color: 'text-indigo-500' },
    { id: 'night', label: 'Đêm', subLabel: '9PM - 12AM', icon: Star, color: 'text-blue-900' },
  ]

  const toggleTimeSlot = (id: string) => {
    const newTimes = new Set(preferredTimes)
    if (newTimes.has(id)) {
      newTimes.delete(id)
    } else {
      newTimes.add(id)
    }
    setPreferredTimes(newTimes)
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6">Bạn có thể học bao nhiêu giờ mỗi tuần?</h3>

      {/* Hours Per Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {HOURS_PER_WEEK.map((time) => (
          <button
            key={time.id}
            onClick={() => onSelect(time.id)}
            className={`p-4 rounded-xl border-2 font-medium transition-all text-left ${
              selected === time.id
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md'
                : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⏰</span>
              <div>
                <div className="font-semibold">{time.label}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Preferred Time Slots */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-indigo-600" />
          Thời gian học ưa thích
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {timeSlots.map((slot) => {
            const Icon = slot.icon
            const isSelected = preferredTimes.has(slot.id)
            
            return (
              <button
                key={slot.id}
                onClick={() => toggleTimeSlot(slot.id)}
                className={`p-4 rounded-lg transition-all duration-200 text-center group ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                    : 'bg-white border-2 border-blue-200 text-gray-700 hover:border-indigo-400 hover:shadow-sm'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 transition-transform group-hover:scale-110 ${
                  isSelected ? 'text-white' : slot.color
                }`} />
                <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {slot.label}
                </div>
                <div className={`text-xs ${isSelected ? 'text-indigo-100' : 'text-gray-600'}`}>
                  {slot.subLabel}
                </div>
              </button>
            )
          })}
        </div>

        {preferredTimes.size > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-indigo-600">✓ Bạn đã chọn:</span>{' '}
              {Array.from(preferredTimes)
                .map(id => timeSlots.find(s => s.id === id)?.label)
                .join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}



// ============ MAIN COMPONENT ============

export default function AiTutor() {
  const { token, user } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // ===== STATES =====
  const [currentStep, setCurrentStep] = useState<Step>('language')
  const [showCustomGoal, setShowCustomGoal] = useState(false)
  
  const [formData, setFormData] = useState<LearningPathRequest>({
    targetLanguage: '',
    currentLevel: '',
    studyGoal: '',
    hoursPerWeek: '',
  })

  const [customGoal, setCustomGoal] = useState('')
  const [generatedRoadmap, setGeneratedRoadmap] = useState<string>('')

  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
    }
  }, [token, user, navigate])

  // ===== MUTATIONS =====
  const generateMutation = useMutation({
    mutationFn: async (data: LearningPathRequest) => {
      const response = await axiosClient.post('/ai-tutor/generate', data)
      return response.data
    },
    onSuccess: (data) => {
      setCurrentStep('success')
      setGeneratedRoadmap(data.path?.generatedRoadmap || '')
      useAuthStore.getState().updateTokens(data.aiTokens)
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error: any) => {
      alert(error.response?.data || 'Lỗi khi generate lộ trình')
      setCurrentStep('time')
    },
  })

  // ===== HANDLERS =====
  const handleNext = () => {
    if (currentStep === 'language' && !formData.targetLanguage) {
      alert('Vui lòng chọn ngôn ngữ/framework')
      return
    }
    if (currentStep === 'level' && !formData.currentLevel) {
      alert('Vui lòng chọn trình độ')
      return
    }
    if (currentStep === 'goal' && !formData.studyGoal) {
      alert('Vui lòng chọn mục tiêu')
      return
    }
    if (currentStep === 'time' && !formData.hoursPerWeek) {
      alert('Vui lòng chọn thời gian học')
      return
    }

    if (currentStep === 'language') setCurrentStep('level')
    else if (currentStep === 'level') setCurrentStep('goal')
    else if (currentStep === 'goal') setCurrentStep('time')
    else if (currentStep === 'time') {
      setCurrentStep('generating')
      // Generate path
      const goalValue = formData.studyGoal === 'custom' ? customGoal : formData.studyGoal
      generateMutation.mutate({
        ...formData,
        studyGoal: goalValue,
      })
    }
  }

  const handleGoalSelect = (goalId: string) => {
    if (goalId === 'custom') {
      setShowCustomGoal(true)
    } else {
      setShowCustomGoal(false)
    }
    setFormData({ ...formData, studyGoal: goalId })
  }

  const handleBack = () => {
    if (currentStep === 'language') navigate('/')
    else if (currentStep === 'level') setCurrentStep('language')
    else if (currentStep === 'goal') setCurrentStep('level')
    else if (currentStep === 'time') setCurrentStep('goal')
  }

  const handleReset = () => {
    setCurrentStep('language')
    setFormData({
      targetLanguage: '',
      currentLevel: '',
      studyGoal: '',
      hoursPerWeek: '',
    })
    setCustomGoal('')
    setShowCustomGoal(false)
    setGeneratedRoadmap('')
  }

  const downloadRoadmap = () => {
    if (!generatedRoadmap) return
    
    const element = document.createElement('a')
    const file = new Blob([generatedRoadmap], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${formData.targetLanguage}-roadmap-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getPreview = () => {
    if (!generatedRoadmap) return ''
    const lines = generatedRoadmap.split('\n')
    return lines.slice(0, 20).join('\n')
  }

  if (!token || !user) {
    return null
  }

  // Get step index for progress
  const steps = ['language', 'level', 'goal', 'time']
  const stepIndex = steps.indexOf(currentStep)

  // Token check for generation step
  const canGenerate = user.aiTokens > 0

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-3 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-7 h-7 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Trợ lý AI Học tập</h1>
                <p className="text-gray-600 mt-1">Hãy cùng tạo lộ trình học tập cá nhân hóa của bạn!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-700">{user.aiTokens}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs Header */}
          <div className="flex border-b border-gray-200 px-6 md:px-8">
            {['Cơ bản', 'Tùy chọn', 'Tạo lộ trình'].map((tab, idx) => {
              let isActive = false
              if (idx === 0) isActive = ['language', 'level', 'goal'].includes(currentStep)
              if (idx === 1) isActive = currentStep === 'time'
              if (idx === 2) isActive = ['generating', 'success'].includes(currentStep)

              return (
                <button
                  key={tab}
                  className={`flex-1 py-4 font-medium transition-all border-b-2 text-center ${
                    isActive
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {/* Progress Indicator */}
          <div className="px-6 md:px-8 pt-6 pb-2 flex justify-center w-full">
            {['language', 'level', 'goal'].includes(currentStep) && (() => {
              const basicSteps = ['language', 'level', 'goal'];
              const basicStepIndex = basicSteps.indexOf(currentStep);
              
              return (
                <div className="flex justify-between items-start mb-6 mx-auto w-full max-w-sm relative">
                  {/* Đường line mờ phía sau */}
                  <div className="absolute top-5 left-8 right-8 h-[2px] bg-gray-200 z-0">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ 
                        width: basicStepIndex === 0 ? '0%' : basicStepIndex === 1 ? '50%' : '100%' 
                      }}
                    />
                  </div>
                  
                  {['Ngôn ngữ', 'Trình độ', 'Mục tiêu'].map((label, idx) => {
                    const isCompleted = idx < basicStepIndex;
                    const isCurrent = idx === basicStepIndex;

                    return (
                      <div key={label} className="flex flex-col items-center relative z-10 w-20">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 mb-2 transition-all ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isCurrent
                              ? 'bg-indigo-600 text-white ring-4 ring-indigo-50'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
                        </div>
                        <span
                          className={`text-sm font-medium text-center whitespace-nowrap ${
                            isCurrent
                              ? 'text-indigo-600'
                              : isCompleted
                              ? 'text-green-500'
                              : 'text-gray-400'
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

            {/* Step Content */}
            <div className="min-h-96 px-0 md:px-0">
              {currentStep === 'language' && (
                <div className="p-6 md:p-8">
                  <Step1Language
                    selected={formData.targetLanguage}
                    onSelect={(value) => setFormData({ ...formData, targetLanguage: value })}
                  />
                </div>
              )}

              {currentStep === 'level' && (
                <div className="p-6 md:p-8">
                  <Step2Level
                    selected={formData.currentLevel}
                    onSelect={(value) => setFormData({ ...formData, currentLevel: value })}
                  />
                </div>
              )}

              {currentStep === 'goal' && (
                <div className="p-6 md:p-8">
                  <Step3Goal
                    selected={formData.studyGoal}
                    customGoal={customGoal}
                    onSelect={handleGoalSelect}
                    onCustomChange={setCustomGoal}
                    showCustomInput={showCustomGoal}
                  />
                </div>
              )}

              {currentStep === 'time' && (
                <div className="p-6 md:p-8">
                  <Step4Time
                    selected={formData.hoursPerWeek}
                    onSelect={(value) => setFormData({ ...formData, hoursPerWeek: value })}
                  />
                </div>
              )}

              {currentStep === 'generating' && (
                <div className="p-6 md:p-8 flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6 animate-pulse">
                    <Bot className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Đang tạo lộ trình...</h3>
                  <p className="text-gray-600">AI đang phân tích yêu cầu của bạn</p>
                  <div className="mt-6 flex gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}

              {currentStep === 'success' && (
                <div className="p-6 md:p-8 flex flex-col items-center justify-center py-20">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">🎉 Sản sáng tạo lộ trình của bạn!</h2>
                  </div>

                  <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-center text-sm">
                      <span className="font-semibold">⚡ Số dư Token của bạn:</span>{' '}
                      <span className="text-yellow-700 font-bold">{user.aiTokens} token</span>
                    </p>
                  </div>

                  {/* Preview Box */}
                  <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 mb-6 max-h-96 overflow-y-auto">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg">📋 Xem trước lộ trình</h4>
                    <div className="bg-white rounded-lg p-4 text-sm text-gray-700 font-mono whitespace-pre-wrap break-words leading-relaxed">
                      {getPreview() || 'Lộ trình đang được xử lý...'}
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center italic">
                      (Đây là {Math.ceil(getPreview().split('\n').length / generatedRoadmap.split('\n').length * 100)}% của lộ trình)
                    </p>
                  </div>

                  <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-center text-sm text-blue-900">
                      ℹ️ Lộ trình của bạn đã sẵn sàng! Tải xuống đầy đủ hoặc xem chi tiết.
                    </p>
                  </div>

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={downloadRoadmap}
                      className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Tải xuống
                    </button>
                    <button
                      onClick={() => navigate('/study')}
                      className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      Xem đầy đủ
                    </button>
                  </div>

                  <button
                    onClick={() => navigate('/')}
                    className="w-full mt-3 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Quay lại
                  </button>
                </div>
              )}
            </div>

          {/* Footer Buttons */}
          {currentStep !== 'success' && currentStep !== 'generating' && (
            <div className="px-6 md:px-8 py-6 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                disabled={currentStep === 'language'}
              >
                Quay lại
              </button>

              {(!canGenerate && currentStep === 'time') ? (
                <button
                  disabled
                  className="px-8 py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  Hết token
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className={`px-8 py-3 font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                    currentStep === 'time'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {currentStep === 'time' ? (
                    <>
                      <Zap className="w-5 h-5" />
                      Tạo Lộ trình của Tôi
                    </>
                  ) : (
                    'Tiếp tục'
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Token Warning */}
        {!canGenerate && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Bạn đã hết Token</h4>
              <p className="text-sm text-red-800 mt-1">
                Bạn cần mua thêm token để tiếp tục tạo lộ trình. Vui lòng nâng cấp gói premium của bạn.
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Nâng cấp ngay
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
