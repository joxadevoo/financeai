'use client'

import { BudgetPlanner } from '@/components/budget/BudgetPlanner'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function BudgetPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t.budget.title}</h1>
        <p className="text-muted-foreground">
          {t.budget.description}
        </p>
      </div>

      <BudgetPlanner />
    </div>
  )
}
