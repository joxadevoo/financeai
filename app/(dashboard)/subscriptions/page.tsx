'use client'

import { SubscriptionList } from '@/components/subscriptions/SubscriptionList'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { motion } from 'framer-motion'

export default function SubscriptionsPage() {
  const { t } = useTranslation()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {(t as any).subscriptions?.title || "Subscriptions"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {(t as any).subscriptions?.description || "Manage your recurring payments and bills."}
        </p>
      </div>

      <SubscriptionList />
    </motion.div>
  )
}
