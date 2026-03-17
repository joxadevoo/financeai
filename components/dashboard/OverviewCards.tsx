'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatters'
import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { calculateTotalIncome, calculateTotalExpenses } from '@/lib/utils/calculations'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function OverviewCards() {
  const { incomes, expenses } = useFinanceStore()
  const { t } = useTranslation()
  
  const totalIncome = calculateTotalIncome(incomes)
  const totalExpense = calculateTotalExpenses(expenses)
  const balance = totalIncome - totalExpense
  const savings = 0 // Temporarily 0 until we fetch from Supabase

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-white/80">{t.overview.totalBalance}</CardTitle>
          <Wallet className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
          <p className="text-xs text-white/60 mt-1">+2.5% {t.overview.fromLastMonth}</p>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur-xl bg-background/80 border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t.overview.monthlyIncome}</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-emerald-500 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" /> +12% {t.overview.fromLastMonth}
          </p>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur-xl bg-background/80 border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t.overview.monthlyExpenses}</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpense)}</div>
          <p className="text-xs text-red-500 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" /> +4% {t.overview.fromLastMonth}
          </p>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur-xl bg-background/80 border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t.overview.totalSavings}</CardTitle>
          <PiggyBank className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(savings)}</div>
          <p className="text-xs text-muted-foreground mt-1">{t.overview.target}: {formatCurrency(10000000)}</p>
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 mt-2">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '32%' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
