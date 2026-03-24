import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export interface Income {
  id: string
  user_id?: string
  name: string
  amount: number
  type: string
  frequency: string
  created_at?: string
}

export interface Expense {
  id: string
  user_id?: string
  name: string
  amount: number
  category: string
  subcategory?: string
  date: string
  isRecurring?: boolean
  created_at?: string
}

export interface Investment {
  id: string
  user_id?: string
  name: string
  type: string
  initialAmount: number
  currentAmount: number
  annualRate: number
  startDate: string
  created_at?: string
}

interface FinanceState {
  incomes: Income[]
  expenses: Expense[]
  investments: Investment[]
  isLoading: boolean
  fetchData: () => Promise<void>
  addIncome: (income: Omit<Income, 'id'>) => Promise<void>
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>
  addInvestment: (investment: Omit<Investment, 'id' | 'currentAmount'>) => Promise<void>
  deleteIncome: (id: string) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  deleteInvestment: (id: string) => Promise<void>
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  incomes: [],
  expenses: [],
  investments: [],
  isLoading: true,
  
  fetchData: async () => {
    set({ isLoading: true })
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      set({ incomes: [], expenses: [], isLoading: false })
      return
    }

    const [incomesRes, expensesRes, investmentsRes] = await Promise.all([
      supabase.from('income_sources').select('*').order('created_at', { ascending: false }),
      supabase.from('expenses').select('*').order('created_at', { ascending: false }),
      supabase.from('investments').select('*').order('created_at', { ascending: false })
    ])

    if (incomesRes.error) toast.error("Daromadlarni yuklashda xato: " + incomesRes.error.message)
    if (expensesRes.error) toast.error("Xarajatlarni yuklashda xato: " + expensesRes.error.message)
    if (investmentsRes.error) toast.error("Kiritmalarni yuklashda xato: " + investmentsRes.error.message)

    const incomes: Income[] = (incomesRes.data || []).map((inc: any) => ({
      id: inc.id,
      user_id: inc.user_id,
      name: inc.name,
      amount: inc.amount,
      type: inc.type || 'Active',
      frequency: inc.frequency || 'Monthly',
      created_at: inc.created_at || undefined,
    }))

    const expenses: Expense[] = (expensesRes.data || []).map((exp: any) => ({
      id: exp.id,
      user_id: exp.user_id,
      name: exp.name,
      amount: exp.amount,
      category: exp.category,
      subcategory: exp.subcategory || undefined,
      date: exp.date || new Date().toISOString(),
      isRecurring: exp.is_recurring || false,
      created_at: exp.created_at || undefined,
    }))

    const investments: Investment[] = (investmentsRes.data || []).map((inv: any) => ({
      id: inv.id,
      user_id: inv.user_id,
      name: inv.name,
      type: inv.type,
      initialAmount: inv.initial_amount || 0,
      currentAmount: inv.initial_amount || 0, // In a real scenario, this would be computed or synced from an API
      annualRate: inv.annual_rate || 0,
      startDate: inv.start_date || new Date().toISOString(),
      created_at: inv.created_at || undefined,
    }))

    set({ incomes, expenses, investments, isLoading: false })
  },

  addIncome: async (income) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error("Foydalanuvchi topilmadi")
      return
    }

    const { data: rawData, error } = await supabase.from('income_sources').insert({
      user_id: user.id,
      name: income.name,
      amount: income.amount,
      type: income.type,
      frequency: income.frequency,
    } as any).select().single()

    const data = rawData as any;

    if (!error && data) {
      const newIncome: Income = {
        id: data.id,
        user_id: data.user_id || user.id,
        name: data.name,
        amount: data.amount,
        type: data.type || 'Active',
        frequency: data.frequency || 'Monthly',
        created_at: data.created_at || undefined,
      }
      set((state) => ({ incomes: [newIncome, ...state.incomes] }))
      toast.success("Daromad qo'shildi")
    } else {
      console.error(error)
      toast.error("Daromad qo'shishda xato: " + error?.message)
      throw error
    }
  },

  addExpense: async (expense) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: rawData, error } = await supabase.from('expenses').insert({
      user_id: user.id,
      name: expense.name,
      amount: expense.amount,
      category: expense.category,
      subcategory: expense.subcategory,
      date: expense.date,
      is_recurring: expense.isRecurring || false,
    } as any).select().single()

    const data = rawData as any;

    if (!error && data) {
      const newExpense: Expense = {
        id: data.id,
        user_id: data.user_id || user.id,
        name: data.name,
        amount: data.amount,
        category: data.category,
        subcategory: data.subcategory || undefined,
        date: data.date || new Date().toISOString(),
        isRecurring: data.is_recurring || false,
        created_at: data.created_at || undefined,
      }
      set((state) => ({ expenses: [newExpense, ...state.expenses] }))
      toast.success("Xarajat qo'shildi")
    } else {
      console.error(error)
      toast.error("Xarajat qo'shishda xato: " + error?.message)
      throw error
    }
  },

  deleteIncome: async (id) => {
    const supabase = createClient()
    const { error } = await supabase.from('income_sources').delete().eq('id', id)
    if (!error) {
      set((state) => ({ incomes: state.incomes.filter(inc => inc.id !== id) }))
      toast.success("Daromad o'chirildi")
    } else {
      toast.error("Xato: " + error.message)
    }
  },

  deleteExpense: async (id) => {
    const supabase = createClient()
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) {
      set((state) => ({ expenses: state.expenses.filter(exp => exp.id !== id) }))
      toast.success("Xarajat o'chirildi")
    } else {
      toast.error("Xato: " + error.message)
    }
  },

  addInvestment: async (investment) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: rawData, error } = await supabase.from('investments').insert({
      user_id: user.id,
      name: investment.name,
      type: investment.type,
      initial_amount: investment.initialAmount,
      annual_rate: investment.annualRate,
      start_date: investment.startDate,
    } as any).select().single()
    const data = rawData as any;

    if (!error && data) {
      const newInv: Investment = {
        id: data.id,
        user_id: data.user_id || user.id,
        name: data.name,
        type: data.type,
        initialAmount: data.initial_amount || 0,
        currentAmount: data.initial_amount || 0,
        annualRate: data.annual_rate || 0,
        startDate: data.start_date || new Date().toISOString(),
        created_at: data.created_at || undefined,
      }
      set((state) => ({ investments: [newInv, ...state.investments] }))
      toast.success("Kiritma qo'shildi")
    } else {
      console.error(error)
      toast.error("Kiritma qo'shishda xato: " + error?.message)
      throw error
    }
  },

  deleteInvestment: async (id) => {
    const supabase = createClient()
    const { error } = await supabase.from('investments').delete().eq('id', id)
    if (!error) {
      set((state) => ({ investments: state.investments.filter(inv => inv.id !== id) }))
      toast.success("Kiritma o'chirildi")
    } else {
      toast.error("Xato: " + error.message)
    }
  }
}))
