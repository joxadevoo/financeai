'use client'

import { SettingsForm } from '@/components/settings/SettingsForm'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          {t.settings.title} <SettingsIcon className="h-6 w-6 text-indigo-500" />
        </h1>
        <p className="text-muted-foreground">
          {t.settings.description}
        </p>
      </div>
      
      <SettingsForm />
    </div>
  )
}
