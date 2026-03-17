'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Lightbulb, TrendingUp, PiggyBank } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'

interface QuickQuestionsProps {
  onSelect: (question: string) => void
}

export function QuickQuestions({ onSelect }: QuickQuestionsProps) {
  const { t } = useTranslation()

  const questions = [
    {
      icon: Lightbulb,
      text: t.aiAdvisor.quickQuestion1,
      prompt: t.aiAdvisor.quickPrompt1
    },
    {
      icon: PiggyBank,
      text: t.aiAdvisor.quickQuestion2,
      prompt: t.aiAdvisor.quickPrompt2
    },
    {
      icon: TrendingUp,
      text: t.aiAdvisor.quickQuestion3,
      prompt: t.aiAdvisor.quickPrompt3
    }
  ]

  return (
    <div className="grid gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
      {questions.map((q, i) => (
        <Button
          key={i}
          variant="outline"
          className="h-auto py-3 px-4 justify-start group hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 text-left whitespace-normal font-normal"
          onClick={() => onSelect(q.prompt)}
        >
          <q.icon className="h-5 w-5 mr-3 text-indigo-500 shrink-0" />
          <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
            {q.text}
          </span>
          <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1 shrink-0 ml-2" />
        </Button>
      ))}
    </div>
  )
}
