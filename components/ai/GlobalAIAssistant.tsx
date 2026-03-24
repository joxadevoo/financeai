'use client'

import { useState, useRef, useEffect } from 'react'
import { BrainCircuit, Send, Loader2, Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { extractExpenseAction } from '@/lib/actions/ai'
import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function GlobalAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const addExpense = useFinanceStore(state => state.addExpense)
  const { language } = useTranslation()
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize SpeechRecognition on mount if supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
      }
    }
  }, [])

  // Update language when language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'uz' ? 'uz-UZ' : 'en-US'
    }
  }, [language])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error(language === 'uz' ? 'Brauzeringiz ovozli yozishni qo\'llab-quvvatlamaydi' : 'Your browser does not support speech recognition')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setPrompt(prev => prev ? prev + ' ' + transcript : transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech error:", event.error)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      } catch (err) {
        console.error("Failed to start speech recognition", err)
        setIsListening(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    const res = await extractExpenseAction(prompt)
    if (res.success && res.data) {
      const exp = res.data
      try {
        await addExpense({
          name: exp.name,
          amount: exp.amount,
          category: exp.category,
          date: exp.date || new Date().toISOString().split('T')[0]
        })
        setIsOpen(false)
        setPrompt('')
      } catch {
        // Handled by store
      }
    } else {
      toast.error('Sizni tushuna olmadim. Iltimos, qaytadan urinib ko\'ring.')
    }
    setLoading(false)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.5 }}
        >
          <Button 
            onClick={() => setIsOpen(true)}
            size="icon" 
            className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 hover:from-indigo-600 hover:to-purple-600 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-0 text-white bg-[length:200%_auto] animate-gradient"
          >
            <BrainCircuit className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] border-indigo-500/20 bg-background/80 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <BrainCircuit className="h-5 w-5" />
              {language === 'uz' ? 'AI Tezkor Xarajat Qo\'shish' : 'AI Expense Quick Add'}
            </DialogTitle>
            <DialogDescription>
              {language === 'uz' 
                ? 'Nima sotib olganingizni yozing, AI uni avtomatik toifalab dasturga qo\'shadi. (Masalan, "Bozorga borib 150000 so\'mlik go\'sht oldim")'
                : 'Just type what you bought, and AI will categorize and add it. (e.g., "I spent 150000 UZS on groceries at Korzinka today")'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input 
              autoFocus
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={language === 'uz' ? "Nimaga xarajat qildingiz?" : "What did you spend on?"}
              disabled={loading}
              className="flex-1 bg-white/50 dark:bg-black/50"
            />
            <Button 
              type="button" 
              onClick={toggleListening}
              disabled={loading} 
              variant="outline"
              size="icon" 
              className={`shrink-0 border-indigo-200 dark:border-indigo-800 ${isListening ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800/50' : 'text-indigo-600 dark:text-indigo-400'}`}
            >
              {isListening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button type="submit" disabled={loading} size="icon" className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
