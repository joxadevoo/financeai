'use client'

import { ExpenseList } from '@/components/expenses/ExpenseList'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useTranslation } from '@/lib/i18n/useTranslation'

import { useState } from 'react'

export default function ExpensesPage() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.expenses.title}</h1>
          <p className="text-muted-foreground">
            {t.expenses.description}
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              {t.expenses.addExpense}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t.expenses.addExpense}</DialogTitle>
              <DialogDescription>
                {t.expenses.formDesc}
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm onSuccess={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <ExpenseList />
    </div>
  )
}
