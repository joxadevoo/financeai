'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Clock, Trash2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useDebtStore } from '@/lib/store/useDebtStore'
import { useCurrencyStore } from '@/lib/store/useCurrencyStore'
import { AiReminder } from './AiReminder'
import { format, parseISO } from 'date-fns'

export function DebtList() {
  const { t, language } = useTranslation()
  const { debts, isLoading, fetchDebts, updateDebtStatus, deleteDebt } = useDebtStore()
  const { currency, rateToUzs } = useCurrencyStore()
  const [activeTab, setActiveTab] = useState<'lent' | 'borrowed'>('lent')

  useEffect(() => {
    fetchDebts()
  }, [])

  const isUSD = currency === 'USD'

  const displayValue = (val: number) => {
    const converted = isUSD ? val / rateToUzs : val
    const formatted = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: isUSD ? 2 : 0
    }).format(converted).replace(/,/g, ' ')
    return isUSD ? `$${formatted}` : `${formatted} so'm`
  }

  const filteredDebts = debts.filter(d => d.type === activeTab)

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl w-full max-w-md shadow-sm border border-neutral-200 dark:border-neutral-700/50">
        <button
          onClick={() => setActiveTab('lent')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'lent' ? 'bg-white dark:bg-neutral-900 shadow text-emerald-600 dark:text-emerald-400' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
        >
          {t.debts?.owedToMe || 'Boshqalar qarzdor (Menga)'}
        </button>
        <button
          onClick={() => setActiveTab('borrowed')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'borrowed' ? 'bg-white dark:bg-neutral-900 shadow text-rose-600 dark:text-rose-400' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
        >
          {t.debts?.iOwe || 'Men qarzdorman'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDebts.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-dashed flex flex-col items-center justify-center">
            <span className="text-4xl mb-3">{activeTab === 'lent' ? '💸' : '🤝'}</span>
            <p className="font-medium text-neutral-600 dark:text-neutral-400">
              {activeTab === 'lent' 
                ? (language === 'uz' ? 'Xozircha hech kimga qarz bermagansiz.' : 'No active debts owed to you.')
                : (language === 'uz' ? 'Xozircha hech kimdan qarz olmagansiz.' : 'You have no debts to repay.')}
            </p>
          </div>
        ) : (
          filteredDebts.map(debt => (
            <Card key={debt.id} className="overflow-hidden border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all group duration-300 hover:-translate-y-1">
              <div className={`h-1.5 w-full ${debt.type === 'lent' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 truncate max-w-[140px]" title={debt.person_name}>{debt.person_name}</h3>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded w-max">
                      <Clock className="w-3.5 h-3.5" />
                      {debt.due_date ? format(parseISO(debt.due_date), 'dd MMM, yyyy') : (language === 'uz' ? 'Muddat yo\'q' : 'No deadline')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-xl">{displayValue(debt.amount)}</div>
                    <div className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${debt.status === 'paid' ? 'border-emerald-200 text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:border-emerald-800' : 'border-amber-200 text-amber-700 bg-amber-100 dark:bg-amber-950 dark:border-amber-800'}`}>
                      {debt.status === 'paid' ? (t.debts?.completed || 'Yopilgan') : (t.debts?.active || 'Kutilmoqda')}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-auto">
                  {debt.status === 'pending' && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => updateDebtStatus(debt.id, 'paid')}
                      className={`flex-none px-3 lg:px-4 ${debt.type === 'lent' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'} text-white shadow-sm font-medium`}
                    >
                      <Check className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">{t.debts?.markPaid || "To'landi"}</span>
                    </Button>
                  )}
                  {debt.status === 'pending' && debt.type === 'lent' && (
                    <div className="flex-1">
                      <AiReminder debt={debt} />
                    </div>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteDebt(debt.id)}
                    className="flex-none px-3 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 transition-colors ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
