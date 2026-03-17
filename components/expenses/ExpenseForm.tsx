'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { useTranslation } from '@/lib/i18n/useTranslation'

interface ExpenseFormProps {
  onSuccess?: () => void
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const addExpense = useFinanceStore((state) => state.addExpense)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    await addExpense({
      name: formData.name,
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date
    })
    
    setLoading(false)
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium leading-none">{t.expenses.descLabel}</label>
        <Input 
          id="name" 
          placeholder={t.expenses.descPlaceholder}
          required 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium leading-none">{t.expenses.amountLabel}</label>
        <Input 
          id="amount" 
          type="number" 
          placeholder={t.expenses.amountPlaceholder}
          required 
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">{t.expenses.categoryLabel}</label>
          <Select 
            value={formData.category} 
            onValueChange={(val) => setFormData({...formData, category: val as string})}
          >
            <SelectTrigger>
              <SelectValue placeholder={t.expenses.selectCategory} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Housing">{t.expenses.housing}</SelectItem>
              <SelectItem value="Food">{t.expenses.food}</SelectItem>
              <SelectItem value="Transport">{t.expenses.transport}</SelectItem>
              <SelectItem value="Utilities">{t.expenses.utilities}</SelectItem>
              <SelectItem value="Dining">{t.expenses.dining}</SelectItem>
              <SelectItem value="Healthcare">{t.expenses.healthcare}</SelectItem>
              <SelectItem value="Entertainment">{t.expenses.entertainment}</SelectItem>
              <SelectItem value="Other">{t.expenses.other}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium leading-none">{t.expenses.dateLabel}</label>
          <Input 
            id="date" 
            type="date" 
            required 
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white">
          {loading ? t.expenses.adding : t.expenses.addExpense}
        </Button>
      </div>
    </form>
  )
}
