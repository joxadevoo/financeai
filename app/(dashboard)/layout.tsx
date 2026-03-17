'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { MobileNav } from '@/components/layout/MobileNav'
import { useFinanceStore } from '@/lib/store/useFinanceStore'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const fetchData = useFinanceStore(state => state.fetchData)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="flex min-h-[100dvh] bg-neutral-50 dark:bg-neutral-950 w-full max-w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full max-w-full md:w-[calc(100%-16rem)] overflow-x-hidden">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 pt-6 w-full max-w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation Sheet */}
      <MobileNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}
