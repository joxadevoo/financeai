'use client'

import { SavingsSimulator } from '@/components/savings/SavingsSimulator'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function SavingsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t.savings.title}</h1>
        <p className="text-muted-foreground">
          {t.savings.description}
        </p>
      </div>

      <SavingsSimulator />
    </div>
  )
}
