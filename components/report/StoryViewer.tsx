'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, TrendingDown, PiggyBank, BrainCircuit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createPortal } from 'react-dom'
import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { generateFinancialReportAction } from '@/lib/actions/ai'

const SLIDE_DURATION = 6000 // 6 soniya har bir slayd uchun

interface StoryViewerProps {
  onClose: () => void
}

export function StoryViewer({ onClose }: StoryViewerProps) {
  const [mounted, setMounted] = useState(false)
  const { incomes, expenses } = useFinanceStore()
  const { language } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [aiMessage, setAiMessage] = useState<string | null>(null)

  // Calculations
  const thisMonth = new Date().toISOString().substring(0, 7)
  const recentExpenses = expenses.filter(e => e.date?.startsWith(thisMonth))
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0)
  const totalExpenses = recentExpenses.reduce((sum, e) => sum + e.amount, 0)
  
  const categories = recentExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {} as Record<string, number>)
  
  const maxCategory = Object.keys(categories).length > 0 
    ? Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b)
    : (language === 'uz' ? 'Yo\'q' : 'None')

  // Slides configuration
  const slides = [
    {
      id: "income",
      gradient: "from-emerald-400 to-teal-700",
      icon: TrendingUp,
      title: language === 'uz' ? "Zo'r Boshlanish!" : "Great Start!",
      text: language === 'uz' ? "Bu oyda sizning umumiy daromadingiz:" : "Your total income this month:",
      value: new Intl.NumberFormat().format(totalIncome),
      desc: language === 'uz' ? "Shunday davom eting! Daromadlarni oshirish o'z qo'lingizda." : "Keep it up! Consistent tracking leads to wealth."
    },
    {
      id: "expenses",
      gradient: "from-rose-500 to-pink-800",
      icon: TrendingDown,
      title: language === 'uz' ? "Jami Xarajatlar..." : "Total Expenses...",
      text: language === 'uz' ? "O'zini ehtiyot qiladigan raqamlar:" : "Your total expenses reached:",
      value: new Intl.NumberFormat().format(totalExpenses),
      desc: language === 'uz' 
        ? `Siz bu oy asosan "${maxCategory}" ga juda ko'p pul yo'naltirdingiz.` 
        : `Your biggest spending category was "${maxCategory}".`
    },
    {
      id: "balance",
      gradient: "from-blue-400 to-indigo-700",
      icon: PiggyBank,
      title: language === 'uz' ? "Qoldiq va Fark" : "Balance Summary",
      text: language === 'uz' ? "Daromad - Xarajat = Sof foydangiz:" : "Income minus Expenses:",
      value: new Intl.NumberFormat().format(totalIncome - totalExpenses),
      desc: totalIncome - totalExpenses > 0 
        ? (language === 'uz' ? "Ajoyib! Siz haqiqiy tejash mutaxassisisiz." : "Awesome! You are highly profitable this month.")
        : (language === 'uz' ? "Minusdasiz! Kelasi oy ehtiyotkorroq bo'lishni tavsiya qilamiz." : "You spent more than you earned. Watch out next month!")
    },
    {
      id: "ai",
      gradient: "from-violet-600 to-fuchsia-800",
      icon: BrainCircuit,
      title: language === 'uz' ? "AI Xulosasi" : "AI Insight",
      text: aiMessage || (language === 'uz' ? "Sun'iy intellekt tahlil qilmoqda..." : "Analyzing your financial behavior..."),
      value: "",
      desc: language === 'uz' ? "Barcha xarajatlar tahlili asosida chiqarilgan individual maslahat." : "Personalized advice derived from your spending logic."
    }
  ]

  // Automatically fetch AI short advice on mount
  useEffect(() => {
    const fetchAi = async () => {
      const summaryData = { totalIncome, totalExpenses, maxCategory, balance: totalIncome - totalExpenses }
      const instruction = language === 'uz' 
        ? 'Based on this data, write 2 extremely short, punchy sentences in UZBEK explaining what this person needs to focus on for their personal finances. Keep it casual and friendly.'
        : 'Based on this data, write 2 extremely short, punchy sentences in ENGLISH explaining what this person needs to focus on for their personal finances. Keep it casual and friendly.'
      
      const res = await generateFinancialReportAction(JSON.stringify(summaryData) + "\n" + instruction)
      if (res.success && res.report) {
         setAiMessage(res.report)
      } else {
         setAiMessage(language === 'uz' ? "Sizni tahlil qila olmadim, biroq hammasi yaxshi!" : "Unable to analyze, but everything is looking decent!")
      }
    }
    fetchAi()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-advance logic
  useEffect(() => {
    let startTime = Date.now()
    let animationFrameId: number

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const newProgress = (elapsed / SLIDE_DURATION) * 100

      if (newProgress >= 100) {
        if (currentSlide < slides.length - 1) {
          setCurrentSlide(prev => prev + 1)
          setProgress(0)
          startTime = Date.now()
          animationFrameId = requestAnimationFrame(updateProgress)
        } else {
          setProgress(100)
        }
      } else {
        setProgress(newProgress)
        animationFrameId = requestAnimationFrame(updateProgress)
      }
    }

    animationFrameId = requestAnimationFrame(updateProgress)
    return () => cancelAnimationFrame(animationFrameId)
  }, [currentSlide, slides.length])

  const goToPrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1)
      setProgress(0)
    }
  }

  const goToNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1)
      setProgress(0)
    }
  }

  const currentInfo = slides[currentSlide]
  const CurrentIcon = currentInfo.icon

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-0 md:p-4 backdrop-blur-md">
      <div className="w-full h-full max-w-[420px] sm:h-[85vh] sm:max-h-[850px] bg-black relative sm:rounded-[2.5rem] overflow-hidden flex flex-col sm:border-[6px] border-neutral-800 shadow-2xl">
        
        {/* Abstract Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentInfo.gradient} opacity-95 transition-colors duration-1000`}>
           <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
           {/* Abstract Circles */}
           <div className="absolute top-10 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl blend-overlay animate-pulse"></div>
           <div className="absolute bottom-10 -left-20 w-80 h-80 bg-black/20 rounded-full blur-3xl blend-overlay"></div>
        </div>

        {/* Top Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-2 p-4 pt-8 sm:pt-6 px-4">
          {slides.map((_, idx) => (
            <div key={idx} className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
              <div 
                className="h-full bg-white transition-all duration-[50px] ease-linear"
                style={{ width: idx === currentSlide ? `${progress}%` : idx < currentSlide ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Close Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="absolute top-10 right-4 z-30 text-white hover:bg-white/20 rounded-full w-10 h-10"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 relative z-10">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -30 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
              className="flex flex-col items-center text-center space-y-6 w-full"
            >
              <div className="w-28 h-28 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center shadow-xl border border-white/20 mb-4 rotate-3">
                <CurrentIcon className="w-14 h-14 text-white drop-shadow-lg" />
              </div>
              
              <h2 className="text-4xl font-black tracking-tight text-white drop-shadow-md leading-tight">
                {currentInfo.title}
              </h2>
              
              <div className="space-y-6 w-full">
                <p className="text-white/90 text-[1.1rem] font-medium px-4">
                  {currentInfo.text}
                </p>
                
                {currentInfo.value && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="text-5xl md:text-6xl font-black text-white px-2 py-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tabular-nums tracking-tighter"
                  >
                    {currentInfo.value}
                  </motion.div>
                )}
                
                <p className="text-white/80 text-sm max-w-[300px] mx-auto pt-6 leading-relaxed font-medium bg-black/10 px-4 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
                  {currentInfo.desc}
                </p>
              </div>

              {currentSlide === slides.length - 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 1 }}
                  className="w-full mt-10"
                >
                  <Button 
                    onClick={onClose}
                    className="w-full bg-white text-indigo-900 hover:bg-neutral-100 rounded-2xl h-14 font-black shadow-2xl transition-transform active:scale-95 text-lg"
                  >
                    {language === 'uz' ? 'Yopish va qaytish' : 'Close Report'}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Click Zones for Navigation */}
        <div className="absolute inset-y-20 left-0 w-[40%] z-20 cursor-w-resize" onClick={goToPrev} />
        <div className="absolute inset-y-20 right-0 w-[60%] z-20 cursor-e-resize" onClick={goToNext} />
      </div>
    </div>,
    document.body
  )
}
