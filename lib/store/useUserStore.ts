import { create } from 'zustand'

interface UserState {
  user: any | null
  profile: any | null
  setUser: (user: any | null) => void
  setProfile: (profile: any | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  clearUser: () => set({ user: null, profile: null }),
}))
