import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Goal } from '@/types/goal'

interface GoalState {
  goals: Goal[]
  isLoading: boolean
  fetchGoals: () => Promise<void>
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => Promise<void>
  updateGoalProgress: (id: string, amountToAdd: number) => Promise<void>
  editGoal: (id: string, updates: Partial<Goal>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: true,
  
  fetchGoals: async () => {
    set({ isLoading: true })
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      set({ goals: [], isLoading: false })
      return
    }

    const { data, error } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error("Maqsadlarni yuklashda xato: " + error.message)
    }

    const goals: Goal[] = (data || []).map((goal: any) => ({
      id: goal.id,
      name: goal.name,
      targetAmount: goal.target_amount,
      currentAmount: goal.current_amount || 0,
      deadline: goal.deadline || undefined,
      color: goal.color || '#3b82f6',
      icon: goal.icon || 'Target',
      created_at: goal.created_at || undefined,
    }))

    set({ goals, isLoading: false })
  },

  addGoal: async (goal) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: rawData, error } = await supabase.from('financial_goals').insert({
      user_id: user.id,
      name: goal.name,
      target_amount: goal.targetAmount,
      current_amount: 0,
      deadline: goal.deadline,
      color: goal.color,
      icon: goal.icon,
    } as any).select().single()

    const data = rawData as any;

    if (!error && data) {
      const newGoal: Goal = {
        id: data.id,
        name: data.name,
        targetAmount: data.target_amount,
        currentAmount: data.current_amount || 0,
        deadline: data.deadline || undefined,
        color: data.color || '#3b82f6',
        icon: data.icon || 'Target',
        created_at: data.created_at || undefined,
      }
      set((state) => ({ goals: [newGoal, ...state.goals] }))
      toast.success("Maqsad qo'shildi")
    } else {
      console.error(error)
      toast.error("Maqsad qo'shishda xato: " + error?.message)
      throw error
    }
  },

  updateGoalProgress: async (id, amountToAdd) => {
    const supabase = createClient()
    const goal = get().goals.find(g => g.id === id)
    if (!goal) return

    const newAmount = goal.currentAmount + amountToAdd
    const { error } = await supabase
      .from('financial_goals')
      .update({ current_amount: newAmount } as any)
      .eq('id', id)

    if (!error) {
      set((state) => ({
        goals: state.goals.map(g => g.id === id ? { ...g, currentAmount: newAmount } : g)
      }))
      toast.success("Maqsad yangilandi")
    } else {
      toast.error("Xato: " + error.message)
    }
  },

  editGoal: async (id, updates) => {
    const supabase = createClient()
    const dbUpdates: any = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.targetAmount !== undefined) dbUpdates.target_amount = updates.targetAmount
    if (updates.currentAmount !== undefined) dbUpdates.current_amount = updates.currentAmount
    if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline
    if (updates.color !== undefined) dbUpdates.color = updates.color
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon

    const { error } = await supabase
      .from('financial_goals')
      .update(dbUpdates as any)
      .eq('id', id)

    if (!error) {
      set((state) => ({
        goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
      }))
      toast.success("Maqsad tahrirlandi")
    } else {
      toast.error("Xato: " + error.message)
    }
  },

  deleteGoal: async (id) => {
    const supabase = createClient()
    const { error } = await supabase.from('financial_goals').delete().eq('id', id)
    if (!error) {
      set((state) => ({ goals: state.goals.filter(g => g.id !== id) }))
      toast.success("Maqsad o'chirildi")
    } else {
      toast.error("Xato: " + error.message)
    }
  }
}))
