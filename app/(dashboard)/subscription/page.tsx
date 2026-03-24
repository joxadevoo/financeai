'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Crown, Users, Sparkles } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { motion } from 'framer-motion'
import { useProfileStore, SubscriptionPlan } from '@/lib/store/useProfileStore'
import { useEffect, useState } from 'react'

export default function SubscriptionPage() {
  const { language } = useTranslation()
  const { profile, fetchProfile, upgradePlan } = useProfileStore()
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionPlan | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    setLoadingPlan(plan)
    await upgradePlan(plan)
    setLoadingPlan(null)
  }

  const currentPlan = profile?.subscription_plan || 'free'

  const plans = [
    {
      id: 'free' as SubscriptionPlan,
      name: language === 'uz' ? 'Bepul' : 'Free',
      price: '$0',
      description: language === 'uz' ? 'Asosiy byudjet va moliyani boshqarish' : 'Basic budget tracking and management',
      features: language === 'uz' ? [
        'Kirim va Chiqimlarni kiritish',
        'Oddiy oylik hisobotlar',
        'Moliyaviy Maqsadlar (chklangan)',
        'Faqat 1 ta foydalanuvchi'
      ] : [
        'Income & Expense tracking',
        'Basic monthly reports',
        'Financial Goals (limited)',
        'Single user only'
      ],
      icon: null,
      highlight: false
    },
    {
      id: 'pro' as SubscriptionPlan,
      name: 'Pro',
      price: '$4.99',
      period: '/mo',
      description: language === 'uz' ? 'Aktiv foydalanuvchilar va AI tahlillari uchun' : 'For active users and AI insights',
      features: language === 'uz' ? [
        'Cheksiz yozuvlar (Kirim/Chiqim)',
        'AI Maslahatchi va tahlillar',
        'Xarajatlarni scan qilish (kamera orqali)',
        'PDF va Excelga eksport qilish',
        'Premium maxsus mavzular (Themes)'
      ] : [
        'Unlimited transactions',
        'AI Insights and Advisor',
        'Scan receipts via camera',
        'Export to PDF and Excel',
        'Premium custom themes'
      ],
      icon: <Crown className="h-5 w-5 text-amber-500" />,
      highlight: true,
      badge: language === 'uz' ? 'Tavsiya qilinadi' : 'Most Popular'
    },
    {
      id: 'family' as SubscriptionPlan,
      name: language === 'uz' ? 'Oila' : 'Family',
      price: '$9.99',
      period: '/mo',
      description: language === 'uz' ? 'Oilaviy xarajatlarni birgalikda boshqaring' : 'Manage family expenses together',
      features: language === 'uz' ? [
        'Pro tarifidagi barcha imkoniyatlar',
        'Umumiy (Shared) hamyonlar',
        '5 tagacha oila a\'zolarini qo\'shish',
        'Oilaga xos statistika va AI xulosalar',
        'A\'zolar uchun maxsus teglar (Rol)'
      ] : [
        'Everything in Pro plan',
        'Shared wallets and budgets',
        'Invite up to 5 family members',
        'Family-specific AI stats',
        'Custom role tags for members'
      ],
      icon: <Users className="h-5 w-5 text-indigo-500" />,
      highlight: false
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header section */}
      <div className="text-center space-y-4 pt-8">
        <h1 className="text-4xl font-bold tracking-tight">
          {language === 'uz' ? 'FinanceAI Tariflari' : 'FinanceAI Plans'}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {language === 'uz' 
            ? 'O\'zingiz yoki oilangiz uchun mos keladigan to\'lov rejasini tanlang va qo\'shimcha imkoniyatlarni oching.' 
            : 'Choose the right plan for yourself or your family and unlock premium features.'}
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id
          const isLoading = loadingPlan === plan.id
          
          return (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: plan.id === 'pro' ? 0.1 : plan.id === 'family' ? 0.2 : 0 }}
              className={`relative ${plan.highlight ? 'md:-mt-4' : ''}`}
            >
              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full flex justify-center">
                  <span className="bg-amber-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {plan.badge}
                  </span>
                </div>
              )}
              
              <Card className={`flex flex-col h-full relative overflow-hidden transition-all duration-300 ${
                plan.highlight 
                  ? 'border-amber-500/50 shadow-lg shadow-amber-500/10 scale-100 hover:scale-[1.02]' 
                  : 'hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}>
                {plan.highlight && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                )}
                <CardHeader className="text-center pb-8 pt-6">
                  <CardTitle className="flex justify-center items-center gap-2 text-2xl mb-2">
                    {plan.icon}
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground font-medium mb-1">{plan.period}</span>}
                  </div>
                  <CardDescription className="h-10 text-sm">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div className={`mt-0.5 rounded-full p-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shrink-0`}>
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="pt-6 pb-8">
                  <Button 
                    variant={isCurrent ? "outline" : plan.highlight ? "default" : "secondary"}
                    className={`w-full h-12 font-medium text-base ${
                      plan.highlight && !isCurrent ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md' : ''
                    }`}
                    disabled={isCurrent || isLoading}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {isCurrent 
                      ? (language === 'uz' ? 'Joriy Tarif' : 'Current Plan')
                      : isLoading 
                        ? (language === 'uz' ? 'Faollashtirilmoqda...' : 'Activating...')
                        : (language === 'uz' ? 'Tanlash' : 'Upgrade')}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )
        })}
      </div>
      
      {/* FAQ or Trust badges can go here */}
      <div className="text-center text-sm text-muted-foreground max-w-xl mx-auto py-8">
        <p>{language === 'uz' ? '* Obuna to\'lovi hozircha olinmaydi, Local Test rejimidasiz. Barcha tariflar test uchun ochiq.' : '* No payment is actually processed right now. You are in local testing mode.'}</p>
      </div>
    </div>
  )
}
