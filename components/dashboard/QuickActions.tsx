'use client'

import { Plus, ScanLine, Wallet, Users } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useRouter } from 'next/navigation'

export function QuickActions() {
  const { language } = useTranslation()
  const router = useRouter()

  const actions = [
    {
      label: language === 'uz' ? 'Xarajat' : 'Expense',
      icon: <Wallet className="w-5 h-5 text-rose-500" />,
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      href: '/expenses'
    },
    {
      label: language === 'uz' ? 'Kirim' : 'Income',
      icon: <Plus className="w-5 h-5 text-emerald-500" />,
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      href: '/income'
    },
    {
      label: language === 'uz' ? 'Scan Chek' : 'Scan Receipt',
      icon: <ScanLine className="w-5 h-5 text-blue-500" />,
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      href: '/ai-advisor'
    },
    {
      label: language === 'uz' ? 'Oila Ulan. (Beta)' : 'Family Share',
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      href: '/family'
    }
  ]
  
  return (
    <div className="grid grid-cols-2 gap-3 h-full min-h-[160px]">
      {actions.map((action, i) => (
        <button 
          key={i}
          onClick={() => router.push(action.href)}
          className="flex flex-col items-center justify-center p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md hover:border-blue-500/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-all duration-300 group h-full focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <div className={`p-3 rounded-full mb-3 ${action.bg} transition-transform group-hover:scale-110 duration-300`}>
            {action.icon}
          </div>
          <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  )
}
