'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, Briefcase, Building, LineChart as LineChartIcon, Landmark } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { ClientOnly } from '@/components/ui/client-only'

export function InvestmentCalc() {
  const { t } = useTranslation()

  const { investments, addInvestment } = useFinanceStore()

  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'deposit',
    initialAmount: '',
    annualRate: '',
    startDate: new Date().toISOString().split('T')[0]
  })

  const totalInvested = investments.reduce((acc: any, inv: any) => acc + (inv.initialAmount || 0), 0)
  const totalCurrent = investments.reduce((acc: any, inv: any) => acc + (inv.currentAmount || 0), 0)
  const totalGain = totalCurrent - totalInvested
  const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0

  // Chart Data
  const typeAllocation = investments.reduce((acc: any, inv: any) => {
    if (!acc[inv.type]) acc[inv.type] = 0
    acc[inv.type] += (inv.currentAmount || 0)
    return acc
  }, {})

  const chartData = Object.keys(typeAllocation).map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: typeAllocation[type]
  }))

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']

  const getIcon = (type: string) => {
    switch (type) {
      case 'stocks': return <LineChartIcon className="h-4 w-4" />
      case 'deposit': return <Landmark className="h-4 w-4" />
      case 'realestate': return <Building className="h-4 w-4" />
      case 'business': return <Briefcase className="h-4 w-4" />
      default: return <LineChartIcon className="h-4 w-4" />
    }
  }

  const handleAddInvestment = async (e: React.FormEvent) => {
    e.preventDefault()
    await addInvestment({
      name: formData.name,
      type: formData.type,
      initialAmount: Number(formData.initialAmount),
      annualRate: Number(formData.annualRate),
      startDate: formData.startDate
    })
    setIsAdding(false)
    setFormData({
      name: '',
      type: 'deposit',
      initialAmount: '',
      annualRate: '',
      startDate: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-white/80">{t.investments.totalPortfolio}</CardTitle>
            <Briefcase className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalCurrent)}</div>
            <p className="text-xs text-white/80 mt-1">
              {t.investments.invested}: {formatCurrency(totalInvested)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.investments.totalReturn}</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(totalGain)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+{totalGainPercent.toFixed(2)}%</span> {t.investments.overall}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800 flex justify-center items-center p-6">
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="w-full h-full min-h-[100px] border-dashed border-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-800" variant="outline">
                <Plus className="mr-2 h-5 w-5" />
                {t.investments.addInvestment}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t.investments.addNewInvestment}</DialogTitle>
                <DialogDescription>{t.investments.trackNewAsset}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddInvestment} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>{t.investments.assetName}</Label>
                  <Input 
                    required 
                    placeholder={t.investments.assetNamePlaceholder}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.investments.assetType}</Label>
                  <Select value={formData.type} onValueChange={val => setFormData({...formData, type: val as string})}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stocks">{t.investments.stocks}</SelectItem>
                      <SelectItem value="deposit">Bank Deposit</SelectItem>
                      <SelectItem value="realestate">{t.investments.realEstate}</SelectItem>
                      <SelectItem value="business">{t.investments.business}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.investments.initialAmount}</Label>
                    <Input 
                      type="number" 
                      required 
                      value={formData.initialAmount}
                      onChange={e => setFormData({...formData, initialAmount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.investments.expectedAnnualRate}</Label>
                    <Input 
                      type="number" 
                      step="0.1" 
                      required 
                      value={formData.annualRate}
                      onChange={e => setFormData({...formData, annualRate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t.investments.startDate}</Label>
                  <Input 
                    type="date" 
                    required 
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <Button type="submit" className="w-full">{t.investments.addAsset}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle>{t.investments.portfolioAssets}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-neutral-50/50 dark:bg-neutral-900/50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">{t.investments.asset}</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">{t.investments.invested}</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">{t.investments.currentValue}</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">{t.investments.return}</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((inv: any) => {
                    const gain = inv.currentAmount - inv.initialAmount
                    const gainPct = inv.initialAmount > 0 ? (gain / inv.initialAmount) * 100 : 0
                    return (
                      <tr key={inv.id} className="border-b border-neutral-100 dark:border-neutral-800/60 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                              {getIcon(inv.type)}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{inv.name}</div>
                              <div className="text-xs text-muted-foreground">{formatDate(inv.startDate)} • {inv.annualRate}% {t.investments.apy}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatCurrency(inv.initialAmount)}</td>
                        <td className="px-4 py-3 font-semibold">{formatCurrency(inv.currentAmount)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 font-medium ${gain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            {gain >= 0 ? '+' : ''}{formatCurrency(gain)}
                            <span className="text-xs ml-1 opacity-70">({gain >= 0 ? '+' : ''}{gainPct.toFixed(1)}%)</span>
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle>{t.investments.assetAllocation}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ClientOnly>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => formatCurrency(Number(value))}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </ClientOnly>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
