'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BrainCircuit, FileText, Loader2, Sparkles } from 'lucide-react'
import { useFinanceStore } from '@/lib/store/useFinanceStore'
import { generateFinancialReportAction } from '@/lib/actions/ai'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/useTranslation'
// We use a simple rich text display. Since react-markdown might not be installed, we use basic white-space pre-wrap or dangerouslySetInnerHTML if we had a parser.
// We'll use pre-wrap for simplicity.

export default function SmartReportPage() {
  const { incomes, expenses, investments } = useFinanceStore()
  const { language } = useTranslation()
  const [report, setReport] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    
    // Prepare anonymized/summarized data
    const thisMonth = new Date().toISOString().substring(0, 7) // YYYY-MM
    const recentExpenses = expenses.filter(e => e.date?.startsWith(thisMonth))
    
    const summaryData = {
      totalIncome: incomes.reduce((sum, i) => sum + i.amount, 0),
      totalExpensesThisMonth: recentExpenses.reduce((sum, e) => sum + e.amount, 0),
      expenseCategories: recentExpenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount
        return acc
      }, {} as Record<string, number>),
      totalInvestments: investments.reduce((sum, i) => sum + Number(i.initialAmount), 0),
    }

    const res = await generateFinancialReportAction(JSON.stringify(summaryData))
    if (res.success && res.report) {
      setReport(res.report)
    }
    setLoading(false)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent inline-flex items-center gap-2">
            AI Smart Report <Sparkles className="h-6 w-6 text-purple-500" />
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'uz' ? 'Moliyaviy holatingiz bo\'yicha sun\'iy intellekt tahlili.' : 'Artificial Intelligence analysis of your financial health.'}
          </p>
        </div>
        
        <Button 
          onClick={handleGenerate} 
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
          {language === 'uz' ? 'Tahlilni boshlash' : 'Generate Analysis'}
        </Button>
      </div>

      <Card className="border-indigo-100 dark:border-indigo-900/50 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            {language === 'uz' ? 'Sizning hisobotingiz' : 'Your Report'}
          </CardTitle>
          <CardDescription>
            {language === 'uz' ? 'Sun\'iy intellekt sizning joriy oylik ma\'lumotlaringiz asosida xulosa beradi.' : 'AI provides conclusions based on your current monthly data.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-indigo-500 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p className="animate-pulse font-medium">Ma'lumotlar tahlil qilinmoqda...</p>
            </div>
          ) : report ? (
            <div className="prose prose-indigo dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300">
              <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-inner">
                {report}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-70">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                <BrainCircuit className="h-8 w-8 text-indigo-500" />
              </div>
              <p className="text-muted-foreground max-w-sm">
                {language === 'uz' ? 'Tahlilni boshlash tugmasini bosib, aqlli hisobotni oling!' : 'Click generate to receive your smart report!'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
