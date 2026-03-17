import { useTranslationStore } from '../store/useTranslationStore'
import { en } from './dictionaries/en'
import { uz } from './dictionaries/uz'

const dictionaries = {
  en,
  uz,
}

export function useTranslation() {
  const language = useTranslationStore((state) => state.language)
  const setLanguage = useTranslationStore((state) => state.setLanguage)

  // Hydration safety: during SSR, Zustand might not match client if persisted to local storage.
  // We return the raw dictionary, but components should handle hydration gracefully if needed.
  // In a dashboard, standard Zustand usage is usually fine.
  
  const t = dictionaries[language]

  return { t, language, setLanguage }
}
