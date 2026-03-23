'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: unknown) {
      setError((err as Error).message || 'Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight">Parolni tiklash</h2>
        <p className="text-sm text-muted-foreground">
          Elektron pochta manzilingizni kiriting. Biz sizga parolni yangilash havolasini yuboramiz.
        </p>
      </div>

      {success ? (
        <div className="p-6 rounded-xl border border-green-100 bg-green-50 dark:bg-green-950/20 dark:border-green-900/50 flex flex-col items-center justify-center text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
          <h3 className="font-medium text-green-800 dark:text-green-300">Havola yuborildi!</h3>
          <p className="text-sm text-green-700 dark:text-green-400">
            {email} pochtasini tekshiring va ko'rsatmalarga amal qiling. (Spam papkasini ham tekshirib ko'ring)
          </p>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Elektron pochta</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 rounded-md border border-red-100 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Yuborilmoqda...' : 'Tasdiqlash'}
          </Button>
        </form>
      )}

      <div className="text-center text-sm">
        <Link href="/login" className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Tizimga kirish bo'limiga qaytish
        </Link>
      </div>
    </div>
  )
}
