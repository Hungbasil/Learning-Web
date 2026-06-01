import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { ArrowLeft, Download, Eye } from 'lucide-react'
import axiosClient from '@/config/axiosClient'

interface PaymentHistoryItem {
  id: number
  type: string
  description: string
  amount: number
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  createdAt: string
  paidAt?: string
  courseTitle?: string
  premiumMonths?: number
}

export default function PaymentHistory() {
  const { token, user } = useAuthStore()
  const navigate = useNavigate()
  const [history, setHistory] = useState<PaymentHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentHistoryItem | null>(null)

  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
      return
    }

    fetchPaymentHistory()
  }, [token, user, navigate])

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/payment/history')
      setHistory(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tải lịch sử thanh toán')
    } finally {
      setLoading(false)
    }
  }

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-700'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700'
      case 'FAILED':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'Thành công'
      case 'PENDING':
        return 'Chưa thanh toán'
      case 'FAILED':
        return 'Thất bại'
      default:
        return status
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PREMIUM':
        return '👑'
      case 'COURSE':
        return '📚'
      case 'AI_TOKENS':
        return '✨'
      default:
        return '💰'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'PREMIUM':
        return 'Nâng cấp Premium'
      case 'COURSE':
        return 'Mua khóa học'
      case 'AI_TOKENS':
        return 'Mua AI Tokens'
      default:
        return type
    }
  }

  if (!token || !user) {
    return null
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-3 md:px-6 py-6 md:py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử thanh toán</h1>
          <p className="text-gray-600">Xem tất cả giao dịch thanh toán của bạn</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <p className="text-gray-600 text-lg">Bạn chưa có giao dịch thanh toán nào</p>
            <button
              onClick={() => navigate('/subscription')}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Nâng cấp Premium ngay
            </button>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  label: 'Tổng chi tiêu',
                  value: formatVND(
                    history
                      .filter(h => h.status === 'SUCCESS')
                      .reduce((sum, h) => sum + h.amount, 0)
                  )
                },
                {
                  label: 'Giao dịch thành công',
                  value: history.filter(h => h.status === 'SUCCESS').length
                },
                {
                  label: 'Giao dịch chưa thanh toán',
                  value: history.filter(h => h.status === 'PENDING').length
                }
              ].map((card, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-2">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {typeof card.value === 'number' ? card.value : card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-bold text-gray-900">Loại giao dịch</th>
                      <th className="text-left py-4 px-6 font-bold text-gray-900">Mô tả</th>
                      <th className="text-right py-4 px-6 font-bold text-gray-900">Số tiền</th>
                      <th className="text-center py-4 px-6 font-bold text-gray-900">Trạng thái</th>
                      <th className="text-left py-4 px-6 font-bold text-gray-900">Ngày giao dịch</th>
                      <th className="text-center py-4 px-6 font-bold text-gray-900">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getTypeIcon(item.type)}</span>
                            <span className="font-medium text-gray-900">{getTypeText(item.type)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-gray-700 font-medium">{item.description}</p>
                            {item.courseTitle && (
                              <p className="text-sm text-gray-600">Khóa học: {item.courseTitle}</p>
                            )}
                            {item.premiumMonths && (
                              <p className="text-sm text-gray-600">Kỳ hạn: {item.premiumMonths} tháng</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-gray-900">
                          {formatVND(item.amount)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          <div className="text-sm">
                            <p>Tạo: {formatDate(item.createdAt)}</p>
                            {item.paidAt && (
                              <p>Thanh toán: {formatDate(item.paidAt)}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => setSelectedTransaction(item)}
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                            title="Chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Chi tiết giao dịch</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-medium text-gray-900">#{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loại:</span>
                  <span className="font-medium text-gray-900">{getTypeText(selectedTransaction.type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-bold text-lg text-indigo-600">{formatVND(selectedTransaction.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`font-medium ${getStatusColor(selectedTransaction.status)}`}>
                    {getStatusText(selectedTransaction.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-medium text-gray-900">{formatDate(selectedTransaction.createdAt)}</span>
                </div>
                {selectedTransaction.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày thanh toán:</span>
                    <span className="font-medium text-gray-900">{formatDate(selectedTransaction.paidAt)}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Đóng
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Tải hoá đơn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
