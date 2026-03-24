import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export type SubscriptionPlan = 'free' | 'pro' | 'family'

interface Profile {
  id: string
  subscription_plan: SubscriptionPlan
}

interface ProfileState {
  profile: Profile | null
  isLoading: boolean
  fetchProfile: () => Promise<void>
  upgradePlan: (plan: SubscriptionPlan) => Promise<void>
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: true,
  
  fetchProfile: async () => {
    set({ isLoading: true })
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      set({ profile: null, isLoading: false })
      return
    }

    // Try fetching profile
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    
    if (error && error.code !== 'PGRST116') {
      console.error(error)
      // Ignore if not found entirely, handled below
    }

    if (!data) {
      // Create profile automatically if it didn't exist
      const { data: newProfile, error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        subscription_plan: 'free'
      } as any).select().single()
      
      if (!insertError && newProfile) {
        set({ profile: newProfile as Profile, isLoading: false })
      } else {
        set({ profile: { id: user.id, subscription_plan: 'free' }, isLoading: false }) // Fallback safe
      }
    } else {
      set({ profile: data as Profile, isLoading: false })
    }
  },

  upgradePlan: async (plan: SubscriptionPlan) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Foydalanuvchi topilmadi')
      return;
    }

    // Har doim obuna qilish (mocked payment successful)
    // @ts-ignore
    const { error } = await supabase.from('profiles').update({ subscription_plan: plan } as any).eq('id', user.id)
    
    if (error) {
      toast.error('Xatolik yuz berdi: ' + error.message)
    } else {
      toast.success(plan === 'free' ? 'Obunangiz bekor qilindi!' : `Tabriklaymiz! Siz ${plan.toUpperCase()} obunasiga o'tdingiz! 🎉`)
      set({ profile: { id: user.id, subscription_plan: plan } })
    }
  }
}))
