import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Định nghĩa chuẩn khớp 100% với Backend trả về
export interface User {
  id: number
  email: string
  fullName: string
  role: string
  aiTokens: number
  totalXp: number
}

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
  updateTokens: (newTokens: number) => void // Dùng khi xài AI bị trừ token
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuth: (token, user) => set({ token, user }),
      
      logout: () => set({ token: null, user: null }),
      
      updateTokens: (newTokens) => 
        set((state) => ({
          user: state.user ? { ...state.user, aiTokens: newTokens } : null
        })),
    }),
    {
      name: 'learning-vn-auth', // Tên key lưu dưới LocalStorage
    }
  )
)