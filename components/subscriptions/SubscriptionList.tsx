'use client'

import { useFinanceStore, Expense } from '@/lib/store/useFinanceStore'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/formatters'
import { Repeat, Calendar, CreditCard, ShieldAlert } from 'lucide-react'

export function SubscriptionList() {
  const { t } = useTranslation()
  const expenses = useFinanceStore(state => state.expenses)

  // Get unique subscriptions (grouping by name)
  const subscriptions = Array.from(
    new Map(
      expenses.filter(e => e.isRecurring).map(e => [e.name.toLowerCase().trim(), e])
    ).values()
  )

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.amount, 0)

  if (subscriptions.length === 0) {
    return (
      <Card className="border-dashed shadow-none bg-neutral-50/50 dark:bg-neutral-900/50">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Repeat className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            {t.subscriptions?.noSubs || "No Subscriptions Found"}
          </h3>
          <p className="text-sm text-neutral-500 mt-1 max-w-sm">
            {t.subscriptions?.noSubsDesc || "Add expenses and mark them as recurring to see them here."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-white/80">
              {t.subscriptions?.monthlyEstimate || "Monthly Estimate"}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMonthly)}</div>
            <p className="text-xs text-white/60 mt-1">{subscriptions.length} {t.subscriptions?.active || "Active"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((sub: Expense) => (
          <Card key={sub.id} className="hover:shadow-md transition-shadow relative overflow-hidden group border-neutral-200 dark:border-neutral-800">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-base">{sub.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 capitalize">{sub.category}</p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
                  <Repeat className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-end justify-between mt-4">
                <div>
                  <p className="text-xs text-neutral-500 font-medium mb-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(sub.date).getDate()}-kun
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(sub.amount)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {t.subscriptions?.active || "Active"}
                  </span>
                </div>
              </div>
            </div>
            {/* AI Warning feature simulation for startup feel */}
            {sub.amount > 500000 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 px-5 py-2 border-t border-amber-100 dark:border-amber-900/50 flex items-center text-xs text-amber-700 dark:text-amber-400">
                <ShieldAlert className="h-3 w-3 mr-1.5 shrink-0" />
                High cost detected. Consider reviewing.
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
