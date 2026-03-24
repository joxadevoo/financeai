'use client'

import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Star, Flame, Code, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function BadgeGrid() {
  const { expenses, incomes, investments } = useFinanceStore()
  const { language } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  // Calculate Badges dynamically
  const savingsAmount = investments.reduce((acc, i) => acc + Number(i.initialAmount), 0)
  const isSaver = savingsAmount > 0
  
  const hasManyExpenses = expenses.length >= 10
  const isConsistent = hasManyExpenses

  const bigSpender = expenses.some(e => e.amount >= 1000000)
  const highIncome = incomes.some(i => i.amount >= 5000000)

  const badges = [
    {
      id: 'saver',
      name: language === 'uz' ? 'Tejamkor' : 'Super Saver',
      desc: language === 'uz' ? 'Investitsiya yoki jamg\'arma boshlaganlar uchun.' : 'For those who started saving or investing.',
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
      earned: isSaver,
      color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
    },
    {
      id: 'consistent',
      name: language === 'uz' ? 'Muntazam' : 'Consistent',
      desc: language === 'uz' ? 'Kamida 10 ta xarajat kiritgan foydalanuvchi.' : 'Recorded at least 10 expenses.',
      icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
      earned: isConsistent,
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    },
    {
      id: 'high_earner',
      name: language === 'uz' ? 'Katta Daromad' : 'High Earner',
      desc: language === 'uz' ? 'Daromadlar manbayi 5 milliondan oshganda.' : 'Single income source over 5M.',
      icon: <Star className="h-6 w-6 text-amber-500" />,
      earned: highIncome,
      color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
    },
    {
      id: 'fire',
      name: language === 'uz' ? 'Kuchli Xarajat' : 'Big Spender',
      desc: language === 'uz' ? '1 milliondan qimmat xarid qilganda.' : 'Made a purchase over 1M.',
      icon: <Flame className="h-6 w-6 text-red-500" />,
      earned: bigSpender,
      color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    }
  ]

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-amber-500" />
        <h2 className="text-xl font-bold tracking-tight">
          {language === 'uz' ? 'Sizning Yutuqlaringiz' : 'Your Achievements'}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={`overflow-hidden transition-all duration-300 ${badge.earned ? badge.color : 'opacity-50 grayscale bg-neutral-100 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-800'}`}>
              <CardContent className="p-4 flex flex-col items-center text-center space-y-2 relative">
                {badge.earned && (
                  <div className="absolute -top-4 -right-4 h-12 w-12 bg-white/20 blur-xl rounded-full" />
                )}
                <div className={`p-3 rounded-full ${badge.earned ? 'bg-white dark:bg-neutral-900 shadow-sm' : 'bg-neutral-200 dark:bg-neutral-800'}`}>
                  {badge.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.desc}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
