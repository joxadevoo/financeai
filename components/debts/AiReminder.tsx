'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { BotMessageSquare, Copy, CheckCircle2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { Debt } from '@/types/debt'
import { toast } from 'sonner'
import { useCurrencyStore } from '@/lib/store/useCurrencyStore'

export function AiReminder({ debt }: { debt: Debt }) {
  const { language } = useTranslation()
  const { currency, rateToUzs } = useCurrencyStore()
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const isUSD = currency === 'USD'
  const convertedAmount = isUSD ? debt.amount / rateToUzs : debt.amount
  const formattedAmount = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: isUSD ? 2 : 0
  }).format(convertedAmount).replace(/,/g, ' ')
  
  const displayAmount = isUSD ? `$${formattedAmount}` : `${formattedAmount} so'm`

  const templates = language === 'uz' ? [
    {
      label: 'Rasmiy',
      text: `Assalomu alaykum, ${debt.person_name}. Yaxshimisiz? Sizga ${displayAmount} atrofida pul berib turgandim. Iloji bo'lsa shuni yaqin orada tushirib bera olasizmi? Oldindan rahmat!`
    },
    {
      label: 'Do\'stona',
      text: `Salom brat! Yaxshimisiz? Haligi ${displayAmount} oldingdan tushdimi? Karta nomerim 8600... 😊 Iloji boricha ertaroq tashlab qo'ya olmaysanmi.`
    },
    {
      label: 'Qat\'iy',
      text: `${debt.person_name}, salom. Eslatib o'tmoqchiman, mendan olgan ${displayAmount} qarzni qaytarish vaqti keldi. Iltimos qisqa fursatda yechim qilib bering.`
    }
  ] : [
    {
      label: 'Formal',
      text: `Hello ${debt.person_name}, I hope you are doing well. I'm just reaching out regarding the ${displayAmount} I lent you. Let me know when you can transfer it.`
    },
    {
      label: 'Friendly',
      text: `Hey ${debt.person_name}! Hope everything is great. Could you gently venmo/transfer the ${displayAmount} when you get a chance? Thanks! 😊`
    },
    {
      label: 'Firm',
      text: `Hi ${debt.person_name}, this is a reminder regarding the ${displayAmount} debt. Please make arrangements to pay it back today.`
    }
  ]

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    toast.success(language === 'uz' ? "Nusxa olindi!" : "Copied to clipboard!")
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-900 dark:hover:bg-indigo-950/50">
          <BotMessageSquare className="w-4 h-4 mr-2" />
          {language === 'uz' ? 'Eslatish (AI SMS)' : 'Remind (AI SMS)'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BotMessageSquare className="w-5 h-5 text-indigo-600" />
            {language === 'uz' ? 'AI Eslatma Yozuvchisi' : 'AI SMS Generator'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2 max-h-[60vh] overflow-y-auto pr-2">
          <p className="text-sm text-muted-foreground mb-4">
            {language === 'uz' 
              ? 'Vaziyatga mos matnni tanlang va nusxa olib yuboring:'
              : 'Choose the appropriate tone and copy to send:'}
          </p>
          {templates.map((tpl, idx) => (
            <div key={idx} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 space-y-2 relative group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">{tpl.label}</span>
              <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 pr-10">{tpl.text}</p>
              <button 
                onClick={() => handleCopy(tpl.text, idx)}
                className="absolute top-4 right-4 p-2 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                {copiedIndex === idx ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
