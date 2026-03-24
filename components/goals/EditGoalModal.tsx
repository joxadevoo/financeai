'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useGoalStore } from '@/lib/store/useGoalStore'
import { Goal } from '@/types/goal'

export function EditGoalModal({ goal, open, onOpenChange }: { goal: Goal, open: boolean, onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation()
  const { editGoal } = useGoalStore()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: goal.name,
    targetAmount: goal.targetAmount.toString(),
    deadline: goal.deadline ? goal.deadline.split('T')[0] : '', // Handles timestamp parsing simply
    color: goal.color,
    icon: goal.icon
  })

  // Update when goal edits props change
  useEffect(() => {
    if (open) {
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
        color: goal.color,
        icon: goal.icon
      })
    }
  }, [goal, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await editGoal(goal.id, {
        name: formData.name,
        targetAmount: Number(formData.targetAmount),
        deadline: formData.deadline || undefined,
        color: formData.color,
        icon: formData.icon
      })
      onOpenChange(false)
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
          <DialogTitle>{t.goals.editGoal}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">{t.goals.nameLabel}</Label>
            <Input 
              id="edit-name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-target">{t.goals.targetAmountLabel}</Label>
            <Input 
              id="edit-target" 
              type="number" 
              required 
              value={formData.targetAmount}
              onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-deadline">{t.goals.deadlineLabel}</Label>
            <Input 
              id="edit-deadline" 
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-color">{t.goals.colorLabel}</Label>
              <div className="flex gap-2 h-10">
                <Input 
                  id="edit-color" 
                  type="color" 
                  className="w-12 p-1 cursor-pointer"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                />
                <Input 
                  type="text" 
                  className="flex-1"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-icon">{t.goals.iconLabel}</Label>
              <Input 
                id="edit-icon" 
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? t.common.loading : t.common.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
