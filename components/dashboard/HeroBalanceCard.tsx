'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { calculateTotalIncome, calculateTotalExpenses } from '@/lib/utils/calculations'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useCurrencyStore } from '@/lib/store/useCurrencyStore'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'
import { format, parseISO, subMonths } from 'date-fns'
import { ClientOnly } from '@/components/ui/client-only'

export function HeroBalanceCard() {
  const { incomes, expenses } = useFinanceStore()
  const { t, language } = useTranslation()
  const { currency, rateToUzs } = useCurrencyStore()

  const rawIncome = calculateTotalIncome(incomes)
  const rawExpense = calculateTotalExpenses(expenses)
  const rawBalance = rawIncome - rawExpense

  const isUSD = currency === 'USD'
  const convertedIncome = isUSD ? rawIncome / rateToUzs : rawIncome
  const convertedExpense = isUSD ? rawExpense / rateToUzs : rawExpense
  const convertedBalance = isUSD ? rawBalance / rateToUzs : rawBalance

  const displayValue = (val: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: isUSD ? 2 : 0,
      maximumFractionDigits: isUSD ? 2 : 0,
    }).format(val).replace(/,/g, ' ');
    return isUSD ? `$${formatted}` : `${formatted} so'm`;
  }

  // Chart data for background (Net worth trend)
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(new Date(), 5 - i)
    return {
      monthKey: format(d, 'yyyy-MM'),
      balance: 0
    }
  })

  let runningBalance = 0;
  chartData.forEach(month => {
    const monthInc = incomes.filter(inc => inc.created_at && format(parseISO(inc.created_at), 'yyyy-MM') === month.monthKey).reduce((acc, curr) => acc + curr.amount, 0);
    const monthExp = expenses.filter(exp => exp.date && format(parseISO(exp.date), 'yyyy-MM') === month.monthKey).reduce((acc, curr) => acc + curr.amount, 0);
    runningBalance += (monthInc - monthExp);
    month.balance = runningBalance;
  });

  return (
    <Card className="h-full relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white border-0 shadow-lg group">
      {/* Abstract Glowing Orbs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-all duration-700" />
      
      <CardContent className="h-full p-6 sm:p-8 flex flex-col justify-between relative z-10">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-blue-100 mb-2">
              <Wallet className="w-3.5 h-3.5" />
              {language === 'uz' ? 'Asosiy Balans' : 'Total Balance'}
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">{displayValue(convertedBalance)}</h2>
            <p className="text-blue-100/80 text-sm font-medium pt-1">
              +12.5% {language === 'uz' ? 'o\'tgan oydan' : 'vs last month'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="space-y-1">
            <p className="text-xs text-blue-200/70 uppercase tracking-wider font-semibold">{t.overview.monthlyIncome}</p>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-300">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">{displayValue(convertedIncome)}</span>
            </div>
          </div>
          <div className="space-y-1 pl-4 border-l border-white/10">
            <p className="text-xs text-blue-200/70 uppercase tracking-wider font-semibold">{t.overview.monthlyExpenses}</p>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-rose-500/20 text-rose-300">
                <TrendingDown className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">{displayValue(convertedExpense)}</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Background Area Chart Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30 pointer-events-none z-0">
        <ClientOnly>
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <AreaChart data={chartData} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHeroBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#ffffff" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorHeroBalance)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ClientOnly>
      </div>
    </Card>
  )
}
