'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/formatters'
import { calculateCompoundInterest } from '@/lib/utils/calculations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { ClientOnly } from '@/components/ui/client-only'

export function SavingsSimulator() {
  const { t } = useTranslation()

  const [params, setParams] = useState({
    initialAmount: 5000000,
    monthlyContribution: 1000000,
    annualRate: 14, // Assuming bank deposit in UZS
    years: 5
  })

  // Generate projections
  const generateData = () => {
    const data = []
    let currentBalance = params.initialAmount
    const monthlyRate = params.annualRate / 100 / 12

    for (let year = 0; year <= params.years; year++) {
      if (year === 0) {
        data.push({ year: `${t.savings.year} ${year}`, balance: currentBalance, contributions: currentBalance })
        continue
      }

      let yearContributions = 0
      for (let month = 1; month <= 12; month++) {
        currentBalance = currentBalance * (1 + monthlyRate) + params.monthlyContribution
        yearContributions += params.monthlyContribution
      }

      data.push({ 
        year: `${t.savings.year} ${year}`, 
        balance: Math.round(currentBalance), 
        contributions: Math.round(params.initialAmount + (year * 12 * params.monthlyContribution))
      })
    }
    return data
  }

  const projectionData = generateData()
  const finalBalance = projectionData[projectionData.length - 1].balance
  const finalContributions = projectionData[projectionData.length - 1].contributions
  const totalInterest = finalBalance - finalContributions

  const presetGoals = [
    { name: t.savings.carDownPayment, target: 50000000, years: 3 },
    { name: t.savings.houseDeposit, target: 200000000, years: 5 },
    { name: t.savings.dreamVacation, target: 25000000, years: 1 },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="col-span-1 shadow-sm border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle>{t.savings.parameters}</CardTitle>
          <CardDescription>{t.savings.parametersDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t.savings.initialDeposit}</Label>
            <Input 
              type="number" 
              value={params.initialAmount}
              onChange={(e) => setParams({...params, initialAmount: Number(e.target.value)})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.savings.monthlyContribution}</Label>
            <Input 
              type="number" 
              value={params.monthlyContribution}
              onChange={(e) => setParams({...params, monthlyContribution: Number(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.savings.annualRate}</Label>
            <Input 
              type="number"
              step="0.1"
              value={params.annualRate}
              onChange={(e) => setParams({...params, annualRate: Number(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.savings.timeHorizon}</Label>
            <div className="flex gap-2 items-center">
              <Input 
                type="range" 
                min="1" 
                max="30" 
                className="flex-1"
                value={params.years}
                onChange={(e) => setParams({...params, years: Number(e.target.value)})}
              />
              <span className="w-12 text-center font-medium">{params.years}{t.savings.y}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h4 className="text-sm font-medium mb-3">{t.savings.quickGoals}</h4>
            <div className="flex flex-wrap gap-2">
              {presetGoals.map((goal, idx) => (
                <Button 
                  key={idx} 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const monthlyNeeded = (goal.target - params.initialAmount) / (goal.years * 12)
                    setParams({
                      ...params,
                      years: goal.years,
                      monthlyContribution: Math.max(0, Math.round(monthlyNeeded))
                    })
                  }}
                >
                  {goal.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="col-span-1 md:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 shadow-sm">
            <CardContent className="p-4 sm:p-6 text-center">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">{t.savings.totalContributions}</p>
              <div className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                {formatCurrency(finalContributions)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 shadow-sm">
            <CardContent className="p-4 sm:p-6 text-center">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">{t.savings.totalInterest}</p>
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(totalInterest)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm">
            <CardContent className="p-4 sm:p-6 text-center">
              <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500 mb-2">{t.savings.finalBalance}</p>
              <div className="text-xl sm:text-2xl font-bold">
                {formatCurrency(finalBalance)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle>{t.savings.growthProjection}</CardTitle>
            <CardDescription>{t.savings.growthDesc} {params.years} {t.savings.years}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ClientOnly>
                <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                  <AreaChart
                    data={projectionData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-neutral-800" />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{fontSize: 12}} dy={10} />
                    <YAxis 
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}m`} 
                      tickLine={false} 
                      axisLine={false}
                      tick={{fontSize: 12}}
                    />
                    <Tooltip 
                      formatter={(value: any) => formatCurrency(Number(value))}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="balance" name="Total Balance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                    <Area type="monotone" dataKey="contributions" name="Principal" stroke="#6b7280" strokeWidth={2} fillOpacity={1} fill="url(#colorContributions)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ClientOnly>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
