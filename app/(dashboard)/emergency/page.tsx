'use client'

import { EmergencyFund } from '@/components/emergency/EmergencyFund'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function EmergencyPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t.emergency.title}</h1>
        <p className="text-muted-foreground">
          {t.emergency.description}
        </p>
      </div>

      <EmergencyFund />
    </div>
  )
}
