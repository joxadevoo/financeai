'use client'

import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { formatCurrency, formatDate } from '@/lib/utils/formatters'
import { Card, CardContent } from '@/components/ui/card'
import { Coffee, ShoppingCart, Home, Car, Zap, MoreHorizontal, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ExportButton } from '@/components/export/ExportButton'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function ExpenseList() {
  const { expenses } = useFinanceStore()
  const { t } = useTranslation()
  
  // Removed mock data

  const exportColumns = [t.expenses.expenseDesc, t.expenses.category, t.expenses.amount, t.expenses.date]
  const mapDataForPdf = (item: any) => [item.name, item.category, item.amount.toString(), formatDate(item.date || new Date().toISOString())]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Housing': return <Home className="h-4 w-4" />
      case 'Food': return <ShoppingCart className="h-4 w-4" />
      case 'Utilities': return <Zap className="h-4 w-4" />
      case 'Transport': return <Car className="h-4 w-4" />
      case 'Dining': return <Coffee className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Housing': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'
      case 'Food': return 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
      case 'Utilities': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400'
      case 'Transport': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
      case 'Dining': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400'
      default: return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900/50 dark:text-neutral-400'
    }
  }

  return (
    <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
      <div className="flex justify-end p-4 border-b">
        <ExportButton 
           data={expenses} 
           filename="expenses_report"
           title={t.expenses.title}
          columns={exportColumns}
          pdfDataMapper={mapDataForPdf}
        />
      </div>
      <CardContent className="p-0">
        <div className="rounded-md overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-neutral-50/50 dark:bg-neutral-900/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{t.expenses.expenseDesc}</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{t.expenses.category}</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{t.expenses.date}</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{t.expenses.amount}</th>
                <th className="px-6 py-4 font-medium text-right whitespace-nowrap">{t.expenses.actions}</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No expenses data available.</td>
                </tr>
              ) : (
                expenses.map((expense: any, index: number) => (
                  <tr 
                    key={expense.id} 
                    className={`border-b border-neutral-100 dark:border-neutral-800/60 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 ${index === expenses.length - 1 ? 'border-b-0' : ''}`}
                  >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(expense.category)}`}>
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div className="font-medium text-foreground">{expense.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                      {expense.category === 'Housing' ? t.expenses.housing :
                       expense.category === 'Food' ? t.expenses.food :
                       expense.category === 'Utilities' ? t.expenses.utilities :
                       expense.category === 'Transport' ? t.expenses.transport :
                       expense.category === 'Dining' ? t.expenses.dining :
                       expense.category === 'Healthcare' ? t.expenses.healthcare :
                       expense.category === 'Entertainment' ? t.expenses.entertainment :
                       t.expenses.other}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem>{t.expenses.editDetails}</DropdownMenuItem>
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
