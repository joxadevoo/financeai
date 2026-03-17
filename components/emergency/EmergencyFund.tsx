'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/formatters'
import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { calculateTotalExpenses } from '@/lib/utils/calculations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShieldCheck, ShieldAlert, TrendingUp } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function EmergencyFund() {
  const { expenses } = useFinanceStore()
  const { t } = useTranslation()
  
  const currentMonthlyExpenses = expenses.length > 0 ? calculateTotalExpenses(expenses) : 8500000
  
  const [data, setData] = useState({
    currentAmount: 15000000,
    targetMonths: 6,
    monthlyContribution: 1500000
  })

  const [isAdding, setIsAdding] = useState(false)
  const [addAmount, setAddAmount] = useState('')

  const targetAmount = currentMonthlyExpenses * data.targetMonths
  const progressPercent = Math.min(100, (data.currentAmount / targetAmount) * 100)
  
  const handleAddFund = (e: React.FormEvent) => {
    e.preventDefault()
    if (!addAmount) return
    
    setData(prev => ({
      ...prev,
      currentAmount: prev.currentAmount + Number(addAmount)
    }))
    setAddAmount('')
    setIsAdding(false)
  }

  const monthsRemaining = data.monthlyContribution > 0 
    ? Math.ceil((targetAmount - data.currentAmount) / data.monthlyContribution)
    : 0

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-1 md:col-span-2 shadow-sm border-neutral-200 dark:border-neutral-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t.emergency.status}</CardTitle>
            <CardDescription>
              {t.emergency.goal}: {data.targetMonths} {t.emergency.monthsOfExpenses} ({formatCurrency(targetAmount)})
            </CardDescription>
          </div>
          {progressPercent >= 100 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 text-sm font-medium">
              <ShieldCheck className="w-4 h-4" /> {t.emergency.fullyFunded}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 text-sm font-medium">
              <ShieldAlert className="w-4 h-4" /> {t.emergency.building}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="flex flex-col items-center justify-center py-6">
            <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {formatCurrency(data.currentAmount)}
            </div>
            <p className="text-muted-foreground mt-2">{t.emergency.currentBalance}</p>
          </div>
          
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="flex justify-between text-sm font-medium">
              <span>{progressPercent.toFixed(1)}%</span>
              <span>{formatCurrency(targetAmount)}</span>
            </div>
            <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-in-out relative" 
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            {!isAdding ? (
              <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                {t.emergency.addFunds}
              </Button>
            ) : (
              <form onSubmit={handleAddFund} className="flex gap-2 w-full max-w-sm animate-in slide-in-from-bottom-4">
                <Input 
                  type="number" 
                  placeholder={t.emergency.amountInUzs}
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  autoFocus
                />
                <Button type="submit">{t.common.save}</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>{t.common.cancel}</Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg">{t.emergency.monthlyExpensesDetails}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border">
            <span className="text-muted-foreground">{t.emergency.averageMonthly}</span>
            <span className="font-semibold">{formatCurrency(currentMonthlyExpenses)}</span>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.emergency.targetSafetyNet}</label>
            <div className="flex gap-2">
              {[3, 6, 9, 12].map(m => (
                <Button 
                  key={m} 
                  variant={data.targetMonths === m ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setData({...data, targetMonths: m})}
                >
                  {m}m
                </Button>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{t.emergency.expertsRecommend}</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg">{t.emergency.projection}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.emergency.monthlyContribution}</label>
            <Input 
              type="number" 
              value={data.monthlyContribution}
              onChange={(e) => setData({...data, monthlyContribution: Number(e.target.value)})}
            />
          </div>
          
          {progressPercent < 100 ? (
            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">{t.emergency.estimatedCompletion}</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {t.emergency.atThisRate} {data.targetMonths}-{t.emergency.monthGoalIn} <strong className="font-bold">{monthsRemaining} {t.savings.years}</strong>.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-center">
              <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                {t.emergency.reachedTarget}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
