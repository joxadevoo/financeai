'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OverviewCards } from '@/components/dashboard/OverviewCards'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { AiTips } from '@/components/dashboard/AiTips'
import { BadgeGrid } from '@/components/achievements/BadgeGrid'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t.overview.title}</h1>
        <p className="text-muted-foreground">
          {t.overview.welcome}
        </p>
      </div>

      <OverviewCards />

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 backdrop-blur-xl bg-background/80 border-neutral-200 dark:border-neutral-800 shadow-sm">
          <CardHeader>
            <CardTitle>{t.overview.incomeVsExpenses}</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <TrendChart />
          </CardContent>
        </Card>
        
        <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-6">
          <AiTips />
        </div>
      </div>

      <BadgeGrid />
    </div>
  )
}
