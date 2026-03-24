import { Goal } from '@/types/goal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Target, Pencil, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n/useTranslation'
import * as Icons from 'lucide-react'

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
  onAddFunds: (goal: Goal) => void
}

export function GoalCard({ goal, onEdit, onDelete, onAddFunds }: GoalCardProps) {
  const { t } = useTranslation()
  const IconComponent = (Icons as any)[goal.icon] || Target
  const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) || 0

  return (
    <Card className="hover:shadow-md transition-shadow relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-full h-1" 
        style={{ backgroundColor: goal.color }}
      />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800" style={{ color: goal.color }}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{goal.name}</CardTitle>
              {goal.deadline && (
                <p className="text-xs text-neutral-500 mt-0.5">
                  {new Date(goal.deadline).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-blue-600" onClick={() => onEdit(goal)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-red-600" onClick={() => onDelete(goal.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{goal.currentAmount.toLocaleString()} {t.common.amount}</span>
            <span className="text-neutral-500">{goal.targetAmount.toLocaleString()}</span>
          </div>
          {/* Default shadcn Progress uses bg-primary for indicator, we use standard style if we want to bypass it, but for simplicity we rely on it. */}
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs font-medium" style={{ color: percentage >= 100 ? '#10b981' : goal.color }}>
              {percentage}% {percentage >= 100 ? t.goals.completed : t.goals.progress}
            </span>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => onAddFunds(goal)}>
              <Plus className="h-3 w-3 mr-1" />
              {t.goals.addFunds}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
