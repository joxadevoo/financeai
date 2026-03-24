'use client'

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { format, parseISO, subMonths } from 'date-fns'
import { ClientOnly } from '@/components/ui/client-only'

export function TrendChart() {
  const { incomes, expenses } = useFinanceStore()
  
  // Create last 6 months data dynamically
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(new Date(), 5 - i)
    return {
      name: format(d, 'MMM'),
      monthKey: format(d, 'yyyy-MM'),
      income: 0,
      expense: 0
    }
  })

  incomes.forEach(inc => {
    if (!inc.created_at) return
    const key = format(parseISO(inc.created_at), 'yyyy-MM')
    const monthData = chartData.find(d => d.monthKey === key)
    if (monthData) monthData.income += inc.amount
  })

  expenses.forEach(exp => {
    if (!exp.date) return
    const key = format(parseISO(exp.date), 'yyyy-MM')
    const monthData = chartData.find(d => d.monthKey === key)
    if (monthData) monthData.expense += exp.amount
  })
  return (
    <div className="h-[300px] w-full">
      <ClientOnly>
        <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-neutral-800" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `${value / 1000000}m`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: any) => `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(value)).replace(/,/g, ' ')} so'm`}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorIncome)" 
              name="Income"
            />
            <Area 
              type="monotone" 
              dataKey="expense" 
              stroke="#ef4444" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorExpense)" 
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ClientOnly>
    </div>
  )
}
