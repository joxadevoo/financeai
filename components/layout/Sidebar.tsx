'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  CreditCard, 
  Home, 
  LineChart, 
  PieChart, 
  PiggyBank, 
  PlusCircle, 
  Settings, 
  TrendingUp,
  BrainCircuit,
  Download,
  Target,
  Repeat,
  FileText,
  Users,
  Crown, // Added Crown icon
  NotebookText // Or Handshake
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

const getNavItems = (t: any, language: string) => [
  { name: t.common.dashboard, href: '/dashboard', icon: Home },
  { name: t.common.income, href: '/income', icon: PlusCircle },
  { name: t.common.expenses, href: '/expenses', icon: CreditCard },
  { name: t.common.budgetPlanner, href: '/budget', icon: PieChart },
  { name: t.common.debts, href: '/debts', icon: NotebookText },
  { name: t.common.subscriptions, href: '/subscriptions', icon: Repeat },
  { name: t.common.savingsSimulator, href: '/savings', icon: PiggyBank },
  { 
    name: language === 'uz' ? "Umumiy Byudjet" : "Shared Wallets", 
    href: '/family', 
    icon: Users,
    badge: 'Beta' 
  },
  {
    name: language === 'uz' ? "Tariflar (Pro)" : "Subscriptions",
    href: '/subscription',
    icon: Crown,
    highlight: true // Maxsus rang uchun belgi
  },
  { name: t.common.smartReport, href: '/report', icon: FileText },
  { name: t.common.emergencyFund, href: '/emergency', icon: BarChart3 },
  { name: t.common.investments, href: '/investment', icon: LineChart },
  { name: t.common.goals, href: '/goals', icon: Target },
  { name: t.common.aiAdvisor, href: '/ai-advisor', icon: BrainCircuit, highlight: true },
]

interface SidebarProps {
  onItemClick?: () => void
}

export function Sidebar({ onItemClick }: SidebarProps = {}) {
  const pathname = usePathname()
  const { t, language } = useTranslation()
  const navItems = getNavItems(t, language)

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Brauzerning standart promptini to'xtatish
      e.preventDefault()
      // Eventni saqlash, keyinroq chaqirish uchun
      setDeferredPrompt(e)
      // Tugmani ko'rsatish
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.info('Ilovani o\'rnatish', {
        description: 'Ilovani o\'rnatish uchun brauzeringiz menyusidan "Add to Home Screen" yoki "Install App" tugmasini bosing.',
        duration: 5000,
      })
      return
    }

    // Promptni ko'rsatish
    deferredPrompt.prompt()
    
    // Foydalanuvchi tanlovini kutish
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('Foydalanuvchi PWA ornatishni qabul qildi')
    } else {
      console.log('Foydalanuvchi PWA ornatishni rad etdi')
    }
    
    // Prompt bir marta ishlatilishi kerak
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold">
          <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            FinanceAI
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'bg-blue-600/10 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                    : item.highlight 
                      ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40' 
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-50'
                )}
                onClick={onItemClick}
              >
                <div className="flex items-center">
                  <item.icon
                    className={cn(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive 
                        ? 'text-blue-700 dark:text-blue-200' 
                        : item.highlight
                          ? 'text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300'
                          : 'text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-300'
                    )}
                  />
                  {item.name}
                </div>
                {item.badge && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-[10px] font-medium text-blue-800 dark:text-blue-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t space-y-1">
        <button
          onClick={handleInstallClick}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 transition-colors"
        >
          <Download className="mr-3 h-5 w-5" />
          {t.common.installApp}
        </button>
        <Link
          href="/settings"
          className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
          onClick={onItemClick}
        >
          <Settings className="mr-3 h-5 w-5 text-neutral-400" />
          {t.common.settings}
        </Link>
      </div>
    </div>
  )
}
