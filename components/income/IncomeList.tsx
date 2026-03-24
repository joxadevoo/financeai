'use client'

import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { formatCurrency, formatDate } from '@/lib/utils/formatters'
import { Card, CardContent } from '@/components/ui/card'
import { Briefcase, TrendingUp, MoreHorizontal } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ExportButton } from '@/components/export/ExportButton'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useFamilyStore } from '@/lib/store/useFamilyStore'

export function IncomeList() {
  const { incomes } = useFinanceStore()
  const { links } = useFamilyStore()
  const { t } = useTranslation()
  
  // Removed mock data

  const exportColumns = [t.income.source, t.income.type, t.income.frequency, t.income.amount, t.common.date]
  const mapDataForPdf = (item: any) => [item.name, item.type, item.frequency, item.amount.toString(), formatDate(item.date || new Date().toISOString())]

  const getIncomeTag = (userId?: string) => {
    if (!userId) return null
    const link = links.find(l => l.member_user_id === userId)
    if (link && link.member_tag) return link.member_tag
    const headLink = links.find(l => l.head_user_id === userId)
    if (headLink) return "Oila boshlig'i" // Fallback if the purchaser is the head user
    return null
  }

  return (
    <Card className="shadow-sm border-neutral-200 dark:border-neutral-800 w-full overflow-hidden">
      <div className="flex justify-end p-4 border-b">
        <ExportButton 
          data={incomes} 
          filename="income_report"
          title={t.income.title}
          columns={exportColumns}
          pdfDataMapper={mapDataForPdf}
        />
      </div>
      <CardContent className="p-0 overflow-hidden">
        <div className="rounded-md overflow-x-auto w-full scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800 pb-2">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-neutral-50/50 dark:bg-neutral-900/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{t.income.source}</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{t.income.type}</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{t.income.frequency}</th>
                <th className="px-6 py-4 font-medium cursor-pointer whitespace-nowrap">
                  <div className="flex items-center gap-1 group">
                    {t.income.amount}
                    <TrendingUp className="h-3 w-3 group-hover:text-blue-500" />
                  </div>
                </th>
                <th className="px-6 py-4 font-medium text-right whitespace-nowrap">{t.income.actions}</th>
              </tr>
            </thead>
            <tbody>
              {incomes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No income data available.</td>
                </tr>
              ) : (
                incomes.map((income: any, index: number) => (
                  <tr 
                    key={income.id} 
                    className={`border-b border-neutral-100 dark:border-neutral-800/60 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 ${index === incomes.length - 1 ? 'border-b-0' : ''}`}
                  >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${income.type === 'Passive' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'}`}>
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <div className="font-medium text-foreground flex items-center gap-2">
                          {income.name}
                          {getIncomeTag(income.user_id) && (
                            <span className="inline-flex items-center rounded-full border px-1.5 py-0 flex-shrink-0 text-[10px] font-semibold bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800 h-5">
                              {getIncomeTag(income.user_id)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${income.type === 'Passive' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'}`}>
                      {income.type === 'Passive' ? t.income.passive : t.income.active}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    {income.frequency === 'Monthly' ? t.income.monthly : 
                     income.frequency === 'Weekly' ? t.income.weekly :
                     income.frequency === 'Quarterly' ? t.income.quarterly : 
                     t.income.oneTime}
                  </td>
                  <td className="px-6 py-4 font-semibold whitespace-nowrap">
                    {formatCurrency(income.amount)}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'ghost' }), "h-8 w-8 p-0")}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem>{t.income.editDetails}</DropdownMenuItem>
                        <DropdownMenuItem>{t.income.viewHistory}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 dark:text-red-400">
                          {t.common.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
