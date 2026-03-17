import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'en' | 'uz'

interface TranslationState {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useTranslationStore = create<TranslationState>()(
  persist(
    (set) => ({
      language: 'uz', // Default to Uzbek as requested
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'finance-ai-lang',
    }
  )
)
