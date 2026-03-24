'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useRouter } from 'next/navigation'

export function GlowingAiCard() {
  const { language } = useTranslation()
  const router = useRouter()

  return (
    <Card className="h-full relative overflow-hidden bg-white dark:bg-neutral-900 border-amber-200 dark:border-amber-800/50 shadow-sm group hover:shadow-md hover:border-amber-300 transition-all cursor-pointer" onClick={() => router.push('/ai-advisor')}>
      <div className="absolute top-0 right-0 p-16 bg-gradient-to-br from-amber-400/20 to-orange-500/20 dark:from-amber-400/5 dark:to-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-1000 group-hover:scale-150 pointer-events-none" />
      
      <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-[11px] font-bold text-amber-700 dark:text-amber-400 mb-4 border border-amber-200 dark:border-amber-800">
            <Sparkles className="w-3.5 h-3.5" />
            Finance AI
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2 leading-tight">
            {language === 'uz' 
              ? 'Xarajatlaringiz o\'tgan haftaga nisbatan 15% ga qisqardi.' 
              : 'Your spending is down 15% compared to last week.'}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
            {language === 'uz' 
              ? 'Ajoyib natija! Agar shu tempda davom etsangiz, yangi maqsadlaringizga 2 xafta barvaqt erishasiz. Davom eting!' 
              : 'Great job! If you keep this pace, you will reach your goals 2 weeks early. Keep it up!'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-500 mt-6 group-hover:translate-x-1 transition-transform">
          {language === 'uz' ? 'To\'liq hisobotni ko\'rish' : 'View full report'}
          <ArrowRight className="w-4 h-4" />
        </div>
      </CardContent>
    </Card>
  )
}
