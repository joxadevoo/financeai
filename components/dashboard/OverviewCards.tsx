'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatters'
import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { calculateTotalIncome, calculateTotalExpenses } from '@/lib/utils/calculations'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useCurrencyStore } from '@/lib/store/useCurrencyStore'
import { motion, Variants } from 'framer-motion'

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

export function OverviewCards() {
  const { incomes, expenses, investments } = useFinanceStore()
  const { t } = useTranslation()
  const { currency, rateToUzs } = useCurrencyStore()
  
  const rawIncome = calculateTotalIncome(incomes)
  const rawExpense = calculateTotalExpenses(expenses)
  const rawBalance = rawIncome - rawExpense
  const rawSavings = investments.reduce((acc, inv) => acc + Number(inv.initialAmount), 0)

  // Convert if USD
  const isUSD = currency === 'USD'
  const convertedIncome = isUSD ? rawIncome / rateToUzs : rawIncome
  const convertedExpense = isUSD ? rawExpense / rateToUzs : rawExpense
  const convertedBalance = isUSD ? rawBalance / rateToUzs : rawBalance
  const convertedSavings = isUSD ? rawSavings / rateToUzs : rawSavings

  // Helper formatter to keep existing formatCurrency function pure
  const displayValue = (val: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: isUSD ? 2 : 0,
      maximumFractionDigits: isUSD ? 2 : 0,
    }).format(val).replace(/,/g, ' ');
    return isUSD ? `$${formatted}` : `${formatted} so'm`;
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      <motion.div variants={item}>
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg border-0 overflow-hidden relative group">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
          <CardTitle className="text-sm font-medium text-white/80">{t.overview.totalBalance}</CardTitle>
          <Wallet className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayValue(convertedBalance)}</div>
          <p className="text-xs text-white/60 mt-1">+2.5% {t.overview.fromLastMonth}</p>
        </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card className="backdrop-blur-xl bg-background/80 border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.overview.monthlyIncome}</CardTitle>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
          <div className="text-2xl font-bold">{displayValue(convertedIncome)}</div>
          <p className="text-xs text-emerald-500 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" /> +12% {t.overview.fromLastMonth}
          </p>
        </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card className="backdrop-blur-xl bg-background/80 border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.overview.monthlyExpenses}</CardTitle>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
          <div className="text-2xl font-bold">{displayValue(convertedExpense)}</div>
          <p className="text-xs text-red-500 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" /> +4% {t.overview.fromLastMonth}
          </p>
        </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card className="backdrop-blur-xl bg-background/80 border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.overview.totalSavings}</CardTitle>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <PiggyBank className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
          <div className="text-2xl font-bold">{displayValue(convertedSavings)}</div>
          <p className="text-xs text-muted-foreground mt-1">{t.overview.target}: {displayValue(isUSD ? 10000000 / rateToUzs : 10000000)}</p>
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 mt-2">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (rawSavings / 10000000) * 100)}%` }}></div>
          </div>
        </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
