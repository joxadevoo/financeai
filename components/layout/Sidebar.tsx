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
  BrainCircuit
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

const getNavItems = (t: any) => [
  { name: t.common.dashboard, href: '/', icon: Home },
  { name: t.common.income, href: '/income', icon: PlusCircle },
  { name: t.common.expenses, href: '/expenses', icon: CreditCard },
  { name: t.common.budgetPlanner, href: '/budget', icon: PieChart },
  { name: t.common.savingsSimulator, href: '/savings', icon: PiggyBank },
  { name: t.common.emergencyFund, href: '/emergency', icon: BarChart3 },
  { name: t.common.investments, href: '/investment', icon: LineChart },
  { name: t.common.aiAdvisor, href: '/ai-advisor', icon: BrainCircuit, highlight: true },
]

interface SidebarProps {
  onItemClick?: () => void
}

export function Sidebar({ onItemClick }: SidebarProps = {}) {
  const pathname = usePathname()
  const { t } = useTranslation()
  const navItems = getNavItems(t)

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            FinanceAI
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
                  isActive 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200' 
                    : item.highlight
                      ? 'text-indigo-600 dark:text-indigo-400 hover:bg-neutral-100 hover:text-indigo-900 dark:hover:bg-neutral-800 dark:hover:text-indigo-300'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                )}
                onClick={onItemClick}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5',
                    isActive 
                      ? 'text-blue-700 dark:text-blue-200' 
                      : item.highlight
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-neutral-400 group-hover:text-neutral-500 dark:text-neutral-400 dark:group-hover:text-neutral-300'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t">
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
