import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Debt, DebtStatus, DebtType } from '@/types/debt'

interface DebtState {
  debts: Debt[]
  isLoading: boolean
  fetchDebts: () => Promise<void>
  addDebt: (data: Omit<Debt, 'id' | 'created_at' | 'user_id' | 'status'>) => Promise<boolean>
  updateDebtStatus: (id: string, status: DebtStatus) => Promise<boolean>
  deleteDebt: (id: string) => Promise<boolean>
}

export const useDebtStore = create<DebtState>((set, get) => ({
  debts: [],
  isLoading: false,

  fetchDebts: async () => {
    set({ isLoading: true })
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      set({ debts: [], isLoading: false })
      return
    }

    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching debts:', error)
      toast.error('Qarzlarni yuklashda xatolik yuz berdi')
    } else {
      set({ debts: data as Debt[] })
    }
    
    set({ isLoading: false })
  },

  addDebt: async (debtData) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Foydalanuvchi topilmadi')
      return false
    }

    const newDebt = {
      ...debtData,
      user_id: user.id,
      status: 'pending' as DebtStatus
    }

    const { data, error } = await (supabase
      .from('debts') as any)
      .insert([newDebt])
      .select()
      .single()

    if (error) {
      console.error('Error adding debt:', error)
      toast.error('Qarz qo\'shishda xatolik')
      return false
    }

    set((state) => ({ debts: [data as Debt, ...state.debts] }))
    toast.success('Qarz muvaffaqiyatli qo\'shildi')
    return true
  },

  updateDebtStatus: async (id: string, status: DebtStatus) => {
    const supabase = createClient()
    const { error } = await (supabase
      .from('debts') as any)
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Error updating debt:', error)
      toast.error('Holatni yangilashda xatolik')
      return false
    }

    set((state) => ({
      debts: state.debts.map((d) => (d.id === id ? { ...d, status } : d))
    }))
    toast.success('Qarz holati yangilandi')
    return true
  },

  deleteDebt: async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('debts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting debt:', error)
      toast.error('Qarzni o\'chirishda xatolik')
      return false
    }

    set((state) => ({
      debts: state.debts.filter((d) => d.id !== id)
    }))
    toast.success('Qarz o\'chirildi')
    return true
  }
}))
