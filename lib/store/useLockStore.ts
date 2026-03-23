import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LockState {
  pin: string | null
  isLocked: boolean
  setPin: (pin: string | null) => void
  unlock: (pin: string) => boolean
  lock: () => void
}

export const useLockStore = create<LockState>()(
  persist(
    (set, get) => ({
      pin: null,
      isLocked: false, // Initialda qulflanmagan bo'ladi, lekin pin mavjud bo'lsa darhol qulflaymiz.
      setPin: (pin) => {
        set({ pin, isLocked: pin !== null })
      },
      unlock: (inputPin) => {
        const { pin } = get()
        if (pin === inputPin) {
          set({ isLocked: false })
          return true
        }
        return false
      },
      lock: () => {
        const { pin } = get()
        if (pin) {
          set({ isLocked: true })
        }
      },
    }),
    {
      name: 'finance-app-lock',
    }
  )
)
