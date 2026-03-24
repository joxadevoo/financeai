'use client'

import { useEffect, useState } from 'react'
import { useGoalStore } from '@/lib/store/useGoalStore'
import { GoalCard } from './GoalCard'
import { Goal } from '@/types/goal'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

// Modals will go here, we will replace these imports later when we create them
import { CreateGoalModal } from './CreateGoalModal'
import { EditGoalModal } from './EditGoalModal'
import { AddFundsModal } from './AddFundsModal'

export function GoalList() {
  const { goals, isLoading, fetchGoals, deleteGoal } = useGoalStore()
  const { t } = useTranslation()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [addingFundsGoal, setAddingFundsGoal] = useState<Goal | null>(null)

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  if (isLoading) {
    return <div className="p-12 text-center text-neutral-500">{t.common.loading}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t.goals.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.goals.description}
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          {t.goals.addGoal}
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-neutral-900 border rounded-xl border-dashed">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">{t.goals.noGoals}</h3>
          <p className="text-sm text-neutral-500 mt-1 mb-6 text-center max-w-sm">
            {t.goals.formDesc}
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t.goals.addGoal}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onEdit={setEditingGoal}
              onDelete={deleteGoal}
              onAddFunds={setAddingFundsGoal}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateGoalModal 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
      />
      
      {editingGoal && (
        <EditGoalModal 
          goal={editingGoal} 
          open={!!editingGoal} 
          onOpenChange={(open: boolean) => !open && setEditingGoal(null)} 
        />
      )}

      {addingFundsGoal && (
        <AddFundsModal 
          goal={addingFundsGoal} 
          open={!!addingFundsGoal} 
          onOpenChange={(open: boolean) => !open && setAddingFundsGoal(null)} 
        />
      )}
    </div>
  )
}
