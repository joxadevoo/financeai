'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { useTranslation } from '@/lib/i18n/useTranslation'

interface IncomeFormProps {
  onSuccess?: () => void
}

export function IncomeForm({ onSuccess }: IncomeFormProps) {
  const addIncome = useFinanceStore((state) => state.addIncome)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'Active',
    frequency: 'Monthly'
  })

  // We are using a simpler approach without setting up the entire react-hook-form + zod 
  // to avoid complex schema definitions in this iteration.
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    await addIncome({
      name: formData.name,
      amount: Number(formData.amount),
      type: formData.type,
      frequency: formData.frequency
    })
    
    setLoading(false)
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium leading-none">{t.income.sourceName}</label>
        <Input 
          id="name" 
          placeholder={t.income.namePlaceholder} 
          required 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium leading-none">{t.income.amount} (UZS)</label>
        <Input 
          id="amount" 
          type="number" 
          placeholder={t.income.amountPlaceholder} 
          required 
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">{t.income.incomeType}</label>
          <Select 
            value={formData.type} 
            onValueChange={(val) => setFormData({...formData, type: val as string})}
          >
            <SelectTrigger>
              <SelectValue placeholder={t.income.selectType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">{t.income.active}</SelectItem>
              <SelectItem value="Passive">{t.income.passive}</SelectItem>
              <SelectItem value="Portfolio">{t.income.portfolio}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">{t.income.frequency}</label>
          <Select 
            value={formData.frequency} 
            onValueChange={(val) => setFormData({...formData, frequency: val as string})}
          >
            <SelectTrigger>
              <SelectValue placeholder={t.income.selectFrequency} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weekly">{t.income.weekly}</SelectItem>
              <SelectItem value="Monthly">{t.income.monthly}</SelectItem>
              <SelectItem value="Quarterly">{t.income.quarterly}</SelectItem>
              <SelectItem value="Yearly">{t.income.yearly}</SelectItem>
              <SelectItem value="One-time">{t.income.oneTime}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? t.income.adding : t.income.addIncome}
        </Button>
      </div>
    </form>
  )
}
