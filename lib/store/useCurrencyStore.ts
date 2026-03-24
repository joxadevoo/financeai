import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CurrencyState {
  currency: 'UZS' | 'USD'
  rateToUzs: number
  setCurrency: (c: 'UZS' | 'USD') => void
  fetchRate: () => Promise<void>
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'UZS',
      rateToUzs: 12600, // Default fallback
      setCurrency: (c) => set({ currency: c }),
      fetchRate: async () => {
        try {
          const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
          const data = await res.json()
          if (data && data.rates && data.rates.UZS) {
            set({ rateToUzs: data.rates.UZS })
          }
        } catch (e) {
          console.error("Failed to fetch rate", e)
        }
      }
    }),
    { name: 'finance-currency' }
  )
)
