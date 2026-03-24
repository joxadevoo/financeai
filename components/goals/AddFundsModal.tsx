'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useGoalStore } from '@/lib/store/useGoalStore'
import { Goal } from '@/types/goal'
import confetti from 'canvas-confetti'

export function AddFundsModal({ goal, open, onOpenChange }: { goal: Goal, open: boolean, onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation()
  const { updateGoalProgress } = useGoalStore()
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const addedAmount = Number(amount)
      await updateGoalProgress(goal.id, addedAmount)
      
      const newTotal = goal.currentAmount + addedAmount
      if (newTotal >= goal.targetAmount && goal.currentAmount < goal.targetAmount) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: [goal.color || '#3b82f6', '#10b981', '#f59e0b']
        })
      }

      onOpenChange(false)
      setAmount('')
    } catch {
      // Error handled by store toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.goals.addFunds} - {goal.name}</DialogTitle>
          <DialogDescription>
            {t.goals.addFundsDesc}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="add-amount">{t.goals.amountToAdd}</Label>
            <Input 
              id="add-amount" 
              type="number"
              placeholder="e.g. 500000"
              required 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {loading ? t.goals.saving : t.goals.updateProgress}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
