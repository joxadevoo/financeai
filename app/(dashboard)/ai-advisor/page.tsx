'use client'

import { ChatWindow } from '@/components/ai/ChatWindow'
import { Sparkles } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function AiAdvisorPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col h-[calc(100dvh-7rem)] md:h-[calc(100dvh-8rem)] animate-in fade-in duration-500">
      <div className="flex flex-col gap-1 md:gap-2 mb-3 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          {t.aiAdvisor.title} <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
        </h1>
        <p className="text-muted-foreground hidden md:block">
          {t.aiAdvisor.description}
        </p>
      </div>

      <div className="flex-1 min-h-0 bg-background border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden flex">
        <ChatWindow />
      </div>
    </div>
  )
}
