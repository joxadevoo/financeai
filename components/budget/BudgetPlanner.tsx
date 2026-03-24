'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/formatters'
import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { calculateTotalIncome, calculateTotalExpenses } from '@/lib/utils/calculations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { ClientOnly } from '@/components/ui/client-only'

export function BudgetPlanner() {
  const { incomes, expenses, investments } = useFinanceStore()
  const { t } = useTranslation()
  
  const totalIncome = calculateTotalIncome(incomes)
  const currentExpenses = calculateTotalExpenses(expenses)
  
  const [rules, setRules] = useState({
    needs: 50,
    wants: 30,
    savings: 20
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSliderChange = (type: 'needs' | 'wants' | 'savings', val: number[]) => {
    // Keep total 100% logic
    const newValue = val[0]
    setRules(prev => ({ ...prev, [type]: newValue }))
  }

  const budgetNeeds = (totalIncome * rules.needs) / 100
  const budgetWants = (totalIncome * rules.wants) / 100
  const budgetSavings = (totalIncome * rules.savings) / 100

  const chartData = [
    { name: t.budget.needs, value: budgetNeeds, color: '#3b82f6' },
    { name: t.budget.wants, value: budgetWants, color: '#8b5cf6' },
    { name: t.budget.savings, value: budgetSavings, color: '#10b981' },
  ]

  // Actual expense categorization from Supabase
  const spentNeeds = expenses
    .filter(e => ['Housing', 'Food', 'Transport', 'Utilities', 'Healthcare'].includes(e.category))
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const spentWants = expenses
    .filter(e => ['Dining', 'Entertainment', 'other', 'Other'].includes(e.category))
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const spentSavings = investments.reduce((sum, inv) => sum + Number(inv.initialAmount), 0)

  const renderProgressBar = (spent: number, budget: number, colorClass: string) => {
    const percent = Math.min(100, (spent / budget) * 100)
    const isOver = spent > budget
    
    return (
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{formatCurrency(spent)} {t.budget.spent}</span>
          <span className="font-medium">{formatCurrency(budget)} {t.budget.limit}</span>
        </div>
        <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className={`h-full ${isOver ? 'bg-red-500' : colorClass} rounded-full transition-all`} 
            style={{ width: `${percent}%` }}
          />
        </div>
        {isOver && <p className="text-xs text-red-500 text-right mt-1">{t.budget.overBudget} {formatCurrency(spent - budget)}</p>}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
      <Card className="col-span-1 lg:col-span-2 shadow-sm border-neutral-200 dark:border-neutral-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t.budget.allocation}</CardTitle>
            <CardDescription>{t.budget.allocationDesc} ({rules.needs}/{rules.wants}/{rules.savings})</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? t.budget.saveSettings : t.budget.editRule}
          </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {isEditing && (
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg space-y-6 mb-8 border transition-all animate-in slide-in-from-top-4">
              <h4 className="font-medium">{t.budget.adjustRule}</h4>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">{t.budget.needs} ({rules.needs}%)</label>
                  </div>
                  <Slider defaultValue={[rules.needs]} max={100} step={5} onValueChange={(val) => handleSliderChange('needs', val as number[])} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">{t.budget.wants} ({rules.wants}%)</label>
                  </div>
                  <Slider defaultValue={[rules.wants]} max={100} step={5} onValueChange={(val) => handleSliderChange('wants', val as number[])} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">{t.budget.savings} ({rules.savings}%)</label>
                  </div>
                  <Slider defaultValue={[rules.savings]} max={100} step={5} onValueChange={(val) => handleSliderChange('savings', val as number[])} />
                </div>
              </div>
              
              <div className="flex justify-between text-sm p-3 rounded bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                <span>{t.budget.totalAllocation}:</span>
                <span className={`font-bold ${rules.needs + rules.wants + rules.savings !== 100 ? 'text-red-500' : ''}`}>
                  {rules.needs + rules.wants + rules.savings}%
                </span>
              </div>
            </div>
          )}

          <div className="grid gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-blue-500" />
                <h3 className="font-semibold text-lg">{t.budget.needs} (50%)</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t.budget.needsDesc}</p>
              {renderProgressBar(spentNeeds, budgetNeeds, 'bg-blue-500')}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-purple-500" />
                <h3 className="font-semibold text-lg">{t.budget.wants} (30%)</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t.budget.wantsDesc}</p>
              {renderProgressBar(spentWants, budgetWants, 'bg-purple-500')}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-emerald-500" />
                <h3 className="font-semibold text-lg">{t.budget.savings} (20%)</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t.budget.savingsDesc}</p>
              {renderProgressBar(spentSavings, budgetSavings, 'bg-emerald-500')}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 shadow-sm border-neutral-200 dark:border-neutral-800 flex flex-col">
        <CardHeader>
          <CardTitle>{t.budget.overview}</CardTitle>
          <CardDescription>{t.budget.overviewDesc}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center">
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full mt-auto pt-6 border-t border-neutral-100 dark:border-neutral-800">
            <h4 className="text-sm font-medium text-muted-foreground mb-4">{t.budget.totalMonthly}</h4>
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {formatCurrency(totalIncome)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
