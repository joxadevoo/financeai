'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BrainCircuit, ArrowRight, ShieldCheck, Sparkles, PieChart, Repeat, Target } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const { language } = useTranslation()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.push('/dashboard')
      } else {
        setChecking(false)
      }
    })
  }, [router])

  if (checking) return null

  return (
    <div className="min-h-[100dvh] bg-neutral-950 text-neutral-50 selection:bg-indigo-500/30 font-sans overflow-x-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-950/80 to-neutral-950 pointer-events-none" />
      
      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between p-6 lg:px-12 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
          <BrainCircuit className="h-8 w-8 text-indigo-500" />
          FinanceAI<span className="text-indigo-500">.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-indigo-400 transition-colors">
            {language === 'uz' ? 'Kirish' : 'Log in'}
          </Link>
          <Link href="/register">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-lg shadow-indigo-500/20 mix-blend-screen">
              {language === 'uz' ? 'Boshlash' : 'Get Started'}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 lg:pt-48 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-3 py-1 mb-8 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {language === 'uz' ? 'Moliyaviy kelajagingizni AI bilan quring' : 'Build your financial future with AI'}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-bold tracking-tighter max-w-4xl bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40 leading-tight"
        >
          {language === 'uz' ? 'Mablag\'laringiz endi aqlli boshqariladi.' : 'Your money, intelligently managed.'}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl font-light"
        >
          {language === 'uz' 
            ? 'Xarajatlarni ovoz orqali qo\'shing, cheklarni AI bilan skanerlang va moliyaviy maqsadlaringizga oson yeting. Bu shunchaki hamyon emas, bu sizning shaxsiy moliyaviy maslahatchingiz.' 
            : 'Add expenses by voice, scan receipts with AI, and reach your goals faster. Not just a tracker, it\'s your personal financial advisor.'}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/register">
            <Button size="lg" className="h-14 px-8 text-base bg-white text-black hover:bg-neutral-200 rounded-full font-semibold">
              {language === 'uz' ? 'Bepul boshlash' : 'Start for free'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-neutral-500 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-4 w-4" />
            {language === 'uz' ? 'Bank darajasidagi xavfsizlik' : 'Bank-level security'}
          </p>
        </motion.div>
      </div>

      {/* Bento Grid Features */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-gradient-to-br from-neutral-900 to-neutral-950 p-8 rounded-3xl border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors" />
            <PieChart className="h-10 w-10 text-indigo-400 mb-6" />
            <h3 className="text-2xl font-bold mb-2">{language === 'uz' ? 'To\'liq Avtomatlashtirilgan' : 'Fully Automated'}</h3>
            <p className="text-neutral-400">{language === 'uz' ? 'Sun\'iy intellekt xarajatlaringizni avtomatik toifalarga ajratadi va qayerga ko\'p sarflayotganingizni aniqlaydi.' : 'AI automatically categorizes your spending and identifies patterns to save you more.'}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-rose-900/40 to-neutral-950 p-8 rounded-3xl border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl group-hover:bg-rose-500/30 transition-colors" />
            <Target className="h-10 w-10 text-rose-400 mb-6" />
            <h3 className="text-2xl font-bold mb-2">{language === 'uz' ? 'Maqsadlar' : 'Smart Goals'}</h3>
            <p className="text-neutral-400">{language === 'uz' ? 'Uy, avtomobil yoki sayohat uchun oson pul yig\'ing.' : 'Save for a home, car, or vacation effortlessly.'}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-emerald-900/40 to-neutral-950 p-8 rounded-3xl border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-colors" />
            <BrainCircuit className="h-10 w-10 text-emerald-400 mb-6" />
            <h3 className="text-2xl font-bold mb-2">AI Maslahatchi</h3>
            <p className="text-neutral-400">{language === 'uz' ? 'Har oy tugaganda AI sizga shaxsiy moliyaviy hisobot va yechimlar beradi.' : 'End of month AI personalized financial reports and solutions.'}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 bg-gradient-to-br from-amber-900/20 to-neutral-950 p-8 rounded-3xl border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors" />
            <Repeat className="h-10 w-10 text-amber-400 mb-6" />
            <h3 className="text-2xl font-bold mb-2">{language === 'uz' ? 'Obunalar Nazorati' : 'Subscription Control'}</h3>
            <p className="text-neutral-400">{language === 'uz' ? 'Unutilgan Netflix, Yandex kabi obunalarni nazorat qiling va ortiqcha xarajatlarni qisqartiring.' : 'Keep track of forgotten subscriptions and cut down on waste.'}</p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 p-8 text-center text-neutral-500">
        <p>© {new Date().getFullYear()} FinanceAI. Created by Startup Mastermind.</p>
      </footer>
    </div>
  )
}
