'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { MobileNav } from '@/components/layout/MobileNav'
import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { AppLock } from '@/components/auth/AppLock'
import { useLockStore } from '@/lib/store/useLockStore'
import { GlobalAIAssistant } from '@/components/ai/GlobalAIAssistant'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { useProfileStore } from '@/lib/store/useProfileStore'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const fetchData = useFinanceStore(state => state.fetchData)
  const fetchProfile = useProfileStore(state => state.fetchProfile)

  useEffect(() => {
    fetchData()
    fetchProfile()
  }, [fetchData, fetchProfile])

  useEffect(() => {
    const lockState = useLockStore.getState()
    if (lockState.pin) lockState.lock() // Dastlabki kirganda yopish

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const currentLockState = useLockStore.getState()
        if (currentLockState.pin) currentLockState.lock()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return (
    <div className="flex bg-neutral-50 dark:bg-neutral-950 fixed inset-0 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r h-full flex-shrink-0 z-50 bg-background">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full overflow-hidden">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 min-h-0 p-4 md:p-8 pt-6 w-full">
          <div className="max-w-7xl mx-auto space-y-6 min-w-0 w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation Sheet */}
      <MobileNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <GlobalAIAssistant />
      <CommandPalette />
      
      {/* App Lock Screen (Full screen PIN lock overlay) */}
      <AppLock />
    </div>
  )
}
