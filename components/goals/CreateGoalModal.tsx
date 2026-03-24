'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useGoalStore } from '@/lib/store/useGoalStore'

export function CreateGoalModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation()
  const { addGoal } = useGoalStore()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    color: '#3b82f6',
    icon: 'Target'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addGoal({
        name: formData.name,
        targetAmount: Number(formData.targetAmount),
        deadline: formData.deadline || undefined,
        color: formData.color,
        icon: formData.icon
      })
      onOpenChange(false)
      setFormData({ name: '', targetAmount: '', deadline: '', color: '#3b82f6', icon: 'Target' })
    } catch {
      // Error is handled by store
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.goals.addGoal}</DialogTitle>
          <DialogDescription>
            {t.goals.formDesc}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.goals.nameLabel}</Label>
            <Input 
              id="name" 
              placeholder={t.goals.namePlaceholder} 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAmount">{t.goals.targetAmountLabel}</Label>
            <Input 
              id="targetAmount" 
              type="number" 
              placeholder={t.goals.targetAmountPlaceholder} 
              required 
              value={formData.targetAmount}
              onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">{t.goals.deadlineLabel}</Label>
            <Input 
              id="deadline" 
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">{t.goals.colorLabel}</Label>
              <div className="flex gap-2 h-10">
                <Input 
                  id="color" 
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
              <Label htmlFor="icon">{t.goals.iconLabel}</Label>
              <Input 
                id="icon" 
                type="text"
                placeholder="Target, Car, Home..."
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
              {loading ? t.goals.adding : t.goals.addGoal}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
