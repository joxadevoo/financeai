'use client'

import { IncomeList } from '@/components/income/IncomeList'
import { IncomeForm } from '@/components/income/IncomeForm'
import { Plus } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useTranslation } from '@/lib/i18n/useTranslation'

import { useState } from 'react'

export default function IncomePage() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.income.title}</h1>
          <p className="text-muted-foreground">
            {t.income.description}
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className={cn(buttonVariants(), "bg-blue-600 hover:bg-blue-700 text-white shadow-md")}>
            <Plus className="mr-2 h-4 w-4" />
            {t.income.addIncome}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t.income.addIncome}</DialogTitle>
              <DialogDescription>
                {t.income.formDesc}
              </DialogDescription>
            </DialogHeader>
            <IncomeForm onSuccess={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <IncomeList />
    </div>
  )
}
