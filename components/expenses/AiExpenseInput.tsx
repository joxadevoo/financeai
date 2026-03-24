'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { toast } from 'sonner'
import { format } from 'date-fns'

export function AiExpenseInput() {
  const { t, language } = useTranslation()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const { addExpense } = useFinanceStore()
  
  // Use translations safely falling back or handling undefined
  const aiStrings = (t as any).aiInput || {
    placeholder: language === 'uz' ? "Masalan: 'Taksiga 20 ming so'm ketdi'" : "Type a text (e.g. 'Spent 20k on Taxi today')",
    buttonText: language === 'uz' ? "Qo'shish" : "Add",
    success: language === 'uz' ? "Xarajat saqlandi:" : "Expense saved:",
    error: language === 'uz' ? "Tahlil qilib bo'lmadi. Boshqacha yozib ko'ring." : "Failed to parse. Please rephrase."
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!response.ok) {
        throw new Error('API Error')
      }

      const data = await response.json()
      
      if (data.error) throw new Error(data.error)
      
      // Call Zustand store
      addExpense({
        amount: data.amount,
        category: data.category,
        date: format(new Date(), 'yyyy-MM-dd'),
        name: data.title
      })

      toast.success(`${aiStrings.success} ${data.title} (${data.amount})`, {
        icon: <Sparkles className="w-4 h-4 text-amber-500" />
      })
      setText('')
    } catch (err) {
      console.error(err)
      toast.error(aiStrings.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-2xl overflow-hidden mb-8 group transition-all focus-within:ring-4 focus-within:ring-indigo-500/20">
      <CardContent className="p-1 bg-white dark:bg-neutral-950 rounded-[14px] transition-colors relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[1px] z-10 rounded-[14px] flex items-center justify-center pointer-events-none">
            <span className="text-sm font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4 animate-spin" /> 
              {language === 'uz' ? 'AI tahlil qilmoqda...' : 'AI parsing magic...'}
            </span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-1 relative z-20">
          <div className="pl-3 py-2 flex-none">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
          </div>
          <Input 
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            placeholder={aiStrings.placeholder}
            className="flex-1 border-0 shadow-none focus-visible:ring-0 px-2 bg-transparent text-base sm:text-lg h-12"
          />
          <Button 
            type="submit" 
            disabled={loading || !text.trim()} 
            className="rounded-xl px-4 sm:px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition-all h-12"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-2" /> : (
              <>
                <span className="hidden sm:inline-block mr-2">{aiStrings.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
