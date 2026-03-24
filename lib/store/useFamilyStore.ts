import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useFinanceStore } from './useFinanceStore'

export interface FamilyLink {
  id: string
  head_user_id: string
  member_user_id: string | null
  member_email: string
  status: 'pending' | 'accepted'
  created_at: string
}

interface FamilyState {
  links: FamilyLink[]
  isLoading: boolean
  fetchLinks: () => Promise<void>
  inviteMember: (email: string) => Promise<void>
  acceptInvite: (id: string) => Promise<void>
  removeLink: (id: string) => Promise<void>
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  links: [],
  isLoading: true,

  fetchLinks: async () => {
    set({ isLoading: true })
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      set({ links: [], isLoading: false })
      return
    }

    const userEmail = user.email

    const { data, error } = await supabase
      .from('family_links')
      .select('*')
      // Note: RLS already filters. We just pull everything allowed for us.
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
    } else {
      set({ links: data || [] })
    }
    set({ isLoading: false })
  },

  inviteMember: async (email: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (email === user.email) {
      toast.error("Siz o'zingizni taklif qila olmaysiz.")
      return
    }

    // @ts-ignore - Ignore missing table type
    const { data, error } = await supabase
      .from('family_links')
      .insert({
        head_user_id: user.id,
        member_email: email,
        status: 'pending'
      } as any)
      .select()
      .single()

    if (error) {
      toast.error("Xatolik. Bu email allaqachon taklif qilingan bo'lishi mumkin.")
      console.error(error)
    } else {
      toast.success("Taklifnoma yuborildi!")
      set((state) => ({ links: [data, ...state.links] }))
    }
  },

  acceptInvite: async (id: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // @ts-ignore - Ignore missing table type
    const { error } = await supabase
      .from('family_links')
      .update({ status: 'accepted', member_user_id: user.id } as any)
      .eq('id', id)

    if (error) {
      toast.error("Qabul qilishda xato")
      console.error(error)
    } else {
      toast.success("Taklif qabul qilindi!")
      get().fetchLinks()
      useFinanceStore.getState().fetchData() // Refresh finances because now we have shared data!
    }
  },

  removeLink: async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('family_links').delete().eq('id', id)
    if (error) {
      toast.error("Xato")
    } else {
      toast.success("O'chirildi")
      set((state) => ({ links: state.links.filter(l => l.id !== id) }))
      useFinanceStore.getState().fetchData() // Refresh
    }
  }
}))
