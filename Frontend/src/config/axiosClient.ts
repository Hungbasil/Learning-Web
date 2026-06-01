import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// BẮT TRƯỚC KHI GỬI
axiosClient.interceptors.request.use(
  (config) => {
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

// BẮT KHI NHẬN KẾT QUẢ
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('[axiosClient] 401/403 Error:', error.response.data)
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export default axiosClient