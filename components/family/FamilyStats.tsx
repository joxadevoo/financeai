'use client'

import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { useFamilyStore } from '@/lib/store/useFamilyStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/formatters'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { BrainCircuit, TrendingDown, TrendingUp, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'

export function FamilyStats() {
  const { expenses, incomes } = useFinanceStore()
  const { links } = useFamilyStore()
  const { language } = useTranslation()
  const [myUserId, setMyUserId] = useState<string | null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setMyUserId(data.user?.id || null))
  }, [])

  if (links.filter(l => l.status === 'accepted').length === 0) {
    return null // Oila a'zolari yo'q bo'lsa statistikani yashirish
  }

  // 1. Odamlarni aniqlash (Tags orqali, yoki default "Siz", "Boshlig'i" va hokazo)
  const getUserName = (userId?: string) => {
    if (!userId) return "Noma'lum"
    if (userId === myUserId) return language === 'uz' ? 'Siz' : 'You'
    const link = links.find(l => l.member_user_id === userId)
    if (link && link.member_tag) return link.member_tag
    const headLink = links.find(l => l.head_user_id === userId)
    if (headLink) return "Oila boshlig'i"
    return "A'zo"
  }

  // 2. Data hisoblash (Faqatgina ushbu oilaviy guruhga aloqador userlar)
  const memberStats: Record<string, { income: number, expense: number, name: string }> = {}

  incomes.forEach(inc => {
    const uid = inc.user_id || 'unknown'
    if (!memberStats[uid]) memberStats[uid] = { income: 0, expense: 0, name: getUserName(inc.user_id) }
    memberStats[uid].income += Number(inc.amount)
  })

  expenses.forEach(exp => {
    const uid = exp.user_id || 'unknown'
    if (!memberStats[uid]) memberStats[uid] = { income: 0, expense: 0, name: getUserName(exp.user_id) }
    memberStats[uid].expense += Number(exp.amount)
  })

  const statsArray = Object.values(memberStats).filter(s => s.income > 0 || s.expense > 0)
  
  if (statsArray.length === 0) return null;

  // Eng ko'p kirim qilgan va Eng ko'p chiqim qilganlarni topish
  const topEarner = [...statsArray].sort((a, b) => b.income - a.income)[0]
  const topSpender = [...statsArray].sort((a, b) => b.expense - a.expense)[0]

  const totalFamilyIncome = statsArray.reduce((acc, curr) => acc + curr.income, 0)
  const totalFamilyExpense = statsArray.reduce((acc, curr) => acc + curr.expense, 0)

  return (
    <Card className="border-indigo-100 dark:border-indigo-900/50 shadow-md bg-gradient-to-br from-white to-indigo-50/30 dark:from-neutral-900 dark:to-indigo-950/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
          <Trophy className="h-5 w-5" />
          {language === 'uz' ? 'Oilaviy Moliyaviy Statistika' : 'Family Financial Stats'}
        </CardTitle>
        <CardDescription>
          {language === 'uz' ? 'Kim qancha hissa qo\'shdi va tahlillar' : 'Who contributed what and analysis'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Top Users */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2 font-medium">
              <TrendingUp className="h-4 w-4" /> Eng ko'p daromad keltirgan
            </div>
            <p className="text-xl font-bold">{topEarner.name}</p>
            <p className="text-sm text-emerald-600/80">{formatCurrency(topEarner.income)}</p>
          </div>
          
          <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-xl border border-rose-100 dark:border-rose-900/50">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-2 font-medium">
              <TrendingDown className="h-4 w-4" /> Eng ko'p xarajat qilgan
            </div>
            <p className="text-xl font-bold">{topSpender.name}</p>
            <p className="text-sm text-rose-600/80">{formatCurrency(topSpender.expense)}</p>
          </div>
        </div>

        {/* Detailed List */}
        <div className="space-y-4 pt-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">A'zolar kesimida:</h4>
          {statsArray.map((stat, i) => {
            const expensePct = totalFamilyExpense > 0 ? (stat.expense / totalFamilyExpense) * 100 : 0
            const incomePct = totalFamilyIncome > 0 ? (stat.income / totalFamilyIncome) * 100 : 0
            return (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-medium text-base">{stat.name}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Daromad bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Kirim</span>
                      <span>{formatCurrency(stat.income)} ({incomePct.toFixed(0)}%)</span>
                    </div>
                    <Progress value={incomePct} className="h-1.5 [&>div]:bg-emerald-500 bg-emerald-100 dark:bg-emerald-950" />
                  </div>
                  
                  {/* Xarajat bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Chiqim</span>
                      <span>{formatCurrency(stat.expense)} ({expensePct.toFixed(0)}%)</span>
                    </div>
                    <Progress value={expensePct} className="h-1.5 [&>div]:bg-rose-500 bg-rose-100 dark:bg-rose-950" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* AI Recommendations */}
        <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 mt-6">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg text-indigo-600">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-300">AI Xulosasi:</h4>
              <p className="text-sm text-indigo-800/80 dark:text-indigo-200/80 mt-1 leading-relaxed">
                Umumiy oilaviy byudjetda <strong>{topEarner.name}</strong> asosan daromad manbasi hisoblanadi. 
                Ammo, <strong>{topSpender.name}</strong> tomonidan qilinayotgan {formatCurrency(topSpender.expense)} xarajatlar 
                umumiy chiqimlarning katta qismini tashkil qilmoqda. <strong>Maslahat:</strong> {topSpender.name} uchinchi darajali 
                xohish-istaklarni tahlil qilishi va eng ko'p ketayotgan toifa xarajatlarini (masalan, kafelar) 10-15% ga qisqartirishi orqali 
                oilaviy pul yig'ish maqsadlariga (Mashina yoki Sayohat) sezilarli darajada tezroq yechish mumkin!
              </p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
