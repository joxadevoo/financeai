'use client'

import { InvestmentCalc } from '@/components/investment/InvestmentCalc'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function InvestmentPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t.investments.title}</h1>
        <p className="text-muted-foreground">
          {t.investments.description}
        </p>
      </div>

      <InvestmentCalc />
    </div>
  )
}
