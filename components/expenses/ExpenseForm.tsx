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
import { Loader2, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { parseReceiptAction } from '@/lib/actions/ai'
import { useRef } from 'react'

interface ExpenseFormProps {
  onSuccess?: () => void
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const addExpense = useFinanceStore((state) => state.addExpense)
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t, language } = useTranslation()
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScanning(true)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Str = reader.result as string
        const res = await parseReceiptAction(base64Str)
        
        if (res.success && res.data) {
          setFormData({
            ...formData,
            name: res.data.name,
            amount: res.data.amount.toString(),
            category: res.data.category,
            date: res.data.date || new Date().toISOString().split('T')[0]
          })
          toast.success(language === 'uz' ? 'Chek muvaffaqiyatli o\'qildi!' : 'Receipt parsed successfully!')
        } else {
          toast.error(language === 'uz' ? 'Chekni o\'qib bo\'lmadi.' : 'Could not parse receipt.')
        }
        setScanning(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error(error)
      setScanning(false)
      toast.error('Error scanning receipt')
    }
  }

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

      <div className="pt-4 flex gap-2 justify-end">
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button 
          type="button" 
          variant="outline" 
          title={language === 'uz' ? 'Chekni skanerlash' : 'Scan Receipt'}
          className="shrink-0 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading || scanning}
        >
          {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        </Button>
        <Button type="submit" disabled={loading || scanning} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white flex-1">
          {loading ? t.expenses.adding : t.expenses.addExpense}
        </Button>
      </div>
    </form>
  )
}
