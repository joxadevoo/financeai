'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useDebtStore } from '@/lib/store/useDebtStore'
import { Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DebtType } from '@/types/debt'

export function AddDebtModal() {
  const { t, language } = useTranslation()
  const { addDebt } = useDebtStore()
  const [open, setOpen] = useState(false)
  
  const [type, setType] = useState<DebtType>('lent')
  const [amount, setAmount] = useState('')
  const [personName, setPersonName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !personName) return
    
    setLoading(true)
    const success = await addDebt({
      type,
      amount: Number(amount),
      person_name: personName,
      due_date: dueDate || null
    })
    setLoading(false)
    if (success) {
      setOpen(false)
      setAmount('')
      setPersonName('')
      setDueDate('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          {t.debts?.addDebt || 'Qarz qo\'shish'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.debts?.addDebt || 'Qarz qo\'shish'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'uz' ? 'Turi' : 'Type'}</label>
            <Select value={type} onValueChange={(val: DebtType) => setType(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lent">{t.debts?.lent || 'Men berdim (Kutilyapti)'}</SelectItem>
                <SelectItem value="borrowed">{t.debts?.borrowed || 'Men oldim (Qaytarishim kerak)'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.debts?.person || 'Kim'}</label>
            <Input 
              required 
              placeholder={language === 'uz' ? 'Masalan: Doston' : 'e.g. John'} 
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.debts?.amount || 'Summa'}</label>
            <Input 
              type="number" 
              required 
              min="0"
              placeholder="50000" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.debts?.dueDate || 'Qaytarish sanasi'} ({language === 'uz' ? 'Ixtiyoriy' : 'Optional'})</label>
            <Input 
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
            {loading ? (language === 'uz' ? 'Saqlanmoqda...' : 'Saving...') : (t.common?.save || 'Saqlash')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
