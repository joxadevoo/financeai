'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { AiTips } from '@/components/dashboard/AiTips'
import { BadgeGrid } from '@/components/achievements/BadgeGrid'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { motion } from 'framer-motion'
import { HeroBalanceCard } from '@/components/dashboard/HeroBalanceCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { GlowingAiCard } from '@/components/dashboard/GlowingAiCard'
import { Sparkles } from 'lucide-react'
import { useFinanceStore } from '@/lib/store/useFinanceStore'

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const { t, language } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>('')
  const { expenses } = useFinanceStore()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '')
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">{language === 'uz' ? 'Bosh sahifa yuklanmoqda...' : 'Loading dashboard...'}</p>
        </div>
      </div>
    )
  }

  // AI mini summary calculation based on current week expense vs overall (mocked for visual)
  const hasExpenses = expenses.length > 0;
  
  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* 1. Katta va Yorqin AI Tabriknomasi */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2 relative z-10"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400">
          {language === 'uz' ? `Xayrli kun, ${userName} 👋` : `Good morning, ${userName} 👋`}
        </h1>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
          <Sparkles className="h-4 w-4" />
          <p>
            {hasExpenses 
              ? (language === 'uz' ? 'Siz byudjetni ajoyib nazorat qilyapsiz. Davom eting!' : 'You are keeping your budget on track. Keep it up!')
              : (language === 'uz' ? 'FinanceAI ga xush kelibsiz! Birinchi xarajatingizni kiriting.' : 'Welcome to FinanceAI! Log your first expense.')}
          </p>
        </div>
      </motion.div>

      {/* 2. Bento Grid Tizimi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Asosiy Katta Blok (Hero Card) - 2 ustunni egallaydi */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 h-full"
        >
          <HeroBalanceCard />
        </motion.div>

        {/* Tezkor Harakatlar Bloki (Quick Actions) - 1 ustun */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-1 h-full"
        >
          <QuickActions />
        </motion.div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafika - 2 ustun */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden group">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">{t.overview.incomeVsExpenses}</CardTitle>
            </CardHeader>
            <CardContent className="pl-0 pb-4">
              <TrendChart />
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Xulosa Bloki - 1 ustun */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <GlowingAiCard />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <BadgeGrid />
      </motion.div>
    </div>
  )
}
