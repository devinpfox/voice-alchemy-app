import { create } from 'zustand'
import { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'student' | 'instructor' | 'admin'
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface UserState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (isLoading: boolean) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  clearUser: () => set({ user: null, profile: null }),
}))
