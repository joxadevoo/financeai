'use client'

import { useTranslation } from '@/lib/i18n/useTranslation'
import { DebtList } from '@/components/debts/DebtList'
import { AddDebtModal } from '@/components/debts/AddDebtModal'
import { BookOpenText } from 'lucide-react'

export default function DebtsPage() {
  const { t, language } = useTranslation()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
            <BookOpenText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.debts?.title || 'Qarzlar Daftari'}</h1>
            <p className="text-muted-foreground text-sm">
              {t.debts?.description || 'Boshqalarga bergan va boshqalardan olgan qarzlaringizni boshqaring.'}
            </p>
          </div>
        </div>
        <AddDebtModal />
      </div>

      <DebtList />
    </div>
  )
}
