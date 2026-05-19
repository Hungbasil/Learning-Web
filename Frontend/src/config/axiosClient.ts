import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

export const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Trỏ thẳng vào cổng Backend
  headers: {
    'Content-Type': 'application/json',
  },
})

// BẮT TRƯỚC KHI GỬI (Request Interceptor)
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token trực tiếp từ Zustand LocalStorage
    const token = useAuthStore.getState().token
    console.log('[axiosClient] Token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// BẮT KHI NHẬN KẾT QUẢ (Response Interceptor)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu Backend trả về 401 Unauthorized hoặc 403 (Hết hạn Token)
    // Chỉ logout, không redirect ngay - để component handle error
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('[axiosClient] 401/403 Error:', error.response.data)
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)