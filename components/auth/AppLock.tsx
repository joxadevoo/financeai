'use client'

import { useState, useEffect } from 'react'
import { useLockStore } from '@/lib/store/useLockStore'
import { Delete, LogOut, Lock } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function AppLock() {
  const { isLocked, unlock, setPin } = useLockStore()
  const { t } = useTranslation()
  const router = useRouter()
  const supabase = createClient()

  const [inputPin, setInputPin] = useState('')
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (inputPin.length === 4) {
      const success = unlock(inputPin)
      if (success) {
        setInputPin('')
        setError(false)
      } else {
        setError(true)
        setTimeout(() => {
          setInputPin('')
          setError(false)
        }, 500) // 0.5s kuting va tozalang (animation uchun)
      }
    }
  }, [inputPin, unlock])

  if (!mounted || !isLocked) return null

  const handleKeyPress = (num: string) => {
    if (inputPin.length < 4) {
      setInputPin((prev) => prev + num)
    }
  }

  const handleDelete = () => {
    setInputPin((prev) => prev.slice(0, -1))
  }

  const handleForgotPin = async () => {
    // Agar parolni esdan chiqarsa, hisobdan chiqib ketishi kerak bo'ladi va PIN o'chadi
    if (confirm(t.settings.logoutWarning)) {
      setPin(null) // PIN ni o'chiramiz
      await supabase.auth.signOut()
      router.push('/login')
    }
  }

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-sm px-6 flex flex-col items-center gap-12">
        
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{t.settings.enterPin}</h2>
          <p className={cn("text-sm transition-colors", error ? "text-red-500 animate-shake" : "text-muted-foreground")}>
            {error ? t.settings.incorrectPin : t.settings.pinLock}
          </p>
        </div>

        {/* Pin Dots */}
        <div className="flex items-center justify-center gap-4 h-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "w-4 h-4 rounded-full transition-all duration-200",
                inputPin.length > i 
                  ? "bg-indigo-600 dark:bg-indigo-500 scale-100" 
                  : "bg-neutral-200 dark:bg-neutral-800 scale-75"
              )}
            />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-[280px] mx-auto">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="h-16 w-full rounded-2xl text-2xl font-medium flex items-center justify-center bg-neutral-50 hover:bg-neutral-200 dark:bg-neutral-900/50 dark:hover:bg-neutral-800 transition-colors focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {num}
            </button>
          ))}
          
          {/* Bottom Row */}
          <div className="h-16 w-full"></div> {/* Bo'sh joy */}
          <button
            onClick={() => handleKeyPress('0')}
            className="h-16 w-full rounded-2xl text-2xl font-medium flex items-center justify-center bg-neutral-50 hover:bg-neutral-200 dark:bg-neutral-900/50 dark:hover:bg-neutral-800 transition-colors focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            disabled={inputPin.length === 0}
            className="h-16 w-full rounded-2xl flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
          >
            <Delete className="h-6 w-6" />
          </button>
        </div>

        <button
          onClick={handleForgotPin}
          className="mt-8 flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Tizimdan chiqish
        </button>

      </div>
    </div>
  )
}
