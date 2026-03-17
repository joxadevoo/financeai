'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function AiTips() {
  const { t } = useTranslation()

  const mockTips = [
    {
      id: 1,
      title: t.aiTips.highSpendingTitle,
      description: t.aiTips.highSpendingDesc,
      impact: "high",
      action: t.aiTips.reviewExpenses
    },
    {
      id: 2,
      title: t.aiTips.unusedSubTitle,
      description: t.aiTips.unusedSubDesc,
      impact: "medium",
      action: t.aiTips.manageSubscriptions
    },
    {
      id: 3,
      title: t.aiTips.greatSavingTitle,
      description: t.aiTips.greatSavingDesc,
      impact: "positive",
      action: t.aiTips.viewTargets
    }
  ]

  return (
    <Card className="h-full border-blue-100 dark:border-blue-900 shadow-sm bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle>{t.aiTips.title}</CardTitle>
            <CardDescription>{t.aiTips.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockTips.map((tip) => (
          <div 
            key={tip.id} 
            className="p-4 rounded-xl border bg-background hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm"
          >
            <h4 className="font-semibold flex items-center gap-2">
              {tip.impact === 'high' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
              {tip.impact === 'medium' && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
              {tip.impact === 'positive' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
              {tip.title}
            </h4>
            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
              {tip.description}
            </p>
            <Button variant="link" className="px-0 h-auto mt-2 text-blue-600 dark:text-blue-400 group">
              {tip.action}
              <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        ))}

        <Button render={<Link href="/ai-advisor" />} className="w-full mt-4" variant="outline">
            {t.aiTips.chatWithAdvisor}
        </Button>
      </CardContent>
    </Card>
  )
}
