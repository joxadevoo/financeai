'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Mail, Sparkles, Heart } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'

export default function FamilyPage() {
  const { language } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setTimeout(() => {
      toast.success(language === 'uz' ? 'Taklifnoma yuborildi!' : 'Invitation sent!')
      setEmail('')
      setLoading(false)
    }, 1500)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center space-y-4 pt-10 pb-6">
        <div className="inline-flex items-center justify-center p-4 bg-rose-100 dark:bg-rose-900/30 rounded-full mb-4">
          <Heart className="h-10 w-10 text-rose-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          {language === 'uz' ? 'Oilaviy Byudjet' : 'Shared Wallets'}
          <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-800 dark:text-blue-300 align-middle">
            BETA
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {language === 'uz' 
            ? 'Birgalikda yig\'ing, birgalikda sarflang. Oila a\'zolaringizni yagona byudjetga taklif qiling.' 
            : 'Save together, spend together. Invite your family members to share a single budget.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-10">
        <Card className="border-rose-100 dark:border-rose-900/50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <Sparkles className="h-5 w-5" />
              Premium Feature
            </CardTitle>
            <CardDescription>
              {language === 'uz' 
                ? 'Hozircha faqat premium a\'zolar va beta testchilari uchun yopiq jamoaviy hamyonlar tizimi. Taklifnoma yuborib joyingizni band qiling.' 
                : 'Currently in closed beta for premium members. Send an invite to reserve your spot.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'uz' ? 'Oila a\'zongiz e-maili' : 'Family Member Email'}
                </label>
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder="partner@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700 text-white">
                <Mail className="w-4 h-4 mr-2" />
                {loading 
                  ? (language === 'uz' ? 'Yuborilmoqda...' : 'Sending...') 
                  : (language === 'uz' ? 'Taklif yuborish' : 'Send Invite')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg shrink-0">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{language === 'uz' ? '2 kishidan 6 kishigacha' : 'Up to 6 members'}</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Barcha a'zolar o'z telefonlaridan harajatlarni kiritib borishadi. Umumiy qoldiqni hammangiz birdaniga ko'rasiz.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg shrink-0">
              <Heart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{language === 'uz' ? 'Umumiy Maqsadlar' : 'Shared Goals'}</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Yangi mashina yoki sayohat uchun oilaviy tarzda birgalikda pul yig'asiz. Qaysi a'zo qancha qadam qo'shganini kuzating.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
