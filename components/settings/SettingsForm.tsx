'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Save, Loader2, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useLockStore } from '@/lib/store/useLockStore'

export function SettingsForm() {
  const { t, language, setLanguage } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { pin, setPin } = useLockStore()
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [currency, setCurrency] = useState('UZS')

  const [isSettingPin, setIsSettingPin] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user && isMounted) {
          setUserId(user.id)
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name, currency')
            .eq('id', user.id)
            .single()

          if (!error && data) {
            const userData = data as any
            if (userData.full_name) setFullName(userData.full_name)
            if (userData.currency) setCurrency(userData.currency)
          }
        }
      } catch (e) {
        console.error('Error loading profile:', e)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    
    loadProfile()
    return () => {
      isMounted = false
    }
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setSaving(true)
    try {
      const { error } = await (supabase.from('profiles') as any).update({
        full_name: fullName,
        currency: currency,
        updated_at: new Date().toISOString()
      }).eq('id', userId)

      if (error) throw error
      toast.success(t.settings.saved)
      
      // Ilovaning hamma joyida Ism darhol yangilanishi uchun reload qilish kerak emas
      // Ammo til yoki valyuta o'zgargani uchun reload qilish mumkin
    } catch (error) {
      console.error('Save error:', error)
      toast.error(t.settings.error)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    if (confirm(t.settings.logoutWarning)) {
      setPin(null) // Chiqib ketayotganda PIN ni ham tozalaymiz
      await supabase.auth.signOut()
      router.push('/login')
    }
  }

  const handleSetPin = () => {
    if (newPin !== confirmPin) {
      toast.error(t.settings.pinMismatch)
      return
    }
    setPin(newPin)
    setIsSettingPin(false)
    setNewPin('')
    setConfirmPin('')
    toast.success(t.settings.pinSetSuccess)
  }

  const handleDisablePin = () => {
    setPin(null)
    toast.success(t.settings.pinRemoved)
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
        <form onSubmit={handleSave}>
          <CardHeader>
            <CardTitle>{t.settings.profile}</CardTitle>
            <CardDescription>{t.settings.preferences}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t.settings.fullName}</Label>
              <Input 
                id="fullName" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t.settings.fullNamePlaceholder}
                className="max-w-md bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
            
            <div className="space-y-2">
              <Label>{t.settings.currency}</Label>
              <Select value={currency} onValueChange={(val) => { if (val) setCurrency(val) }}>
                <SelectTrigger className="w-full max-w-md bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UZS">UZS - O&apos;zbek So&apos;mi</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="bg-neutral-50/50 dark:bg-neutral-900/50 px-6 py-4 flex justify-end rounded-b-lg border-t border-neutral-100 dark:border-neutral-800">
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {t.common.save}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle>{t.settings.appSettings}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t.settings.language}</Label>
            <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
              <SelectTrigger className="w-full max-w-md bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uz">{t.settings.uzbek}</SelectItem>
                <SelectItem value="en">{t.settings.english}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.settings.theme}</Label>
            <Select value={theme} onValueChange={(val) => { if (val) setTheme(val) }}>
              <SelectTrigger className="w-full max-w-md bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t.settings.light}</SelectItem>
                <SelectItem value="dark">{t.settings.dark}</SelectItem>
                <SelectItem value="system">{t.settings.system}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle>{t.settings.security}</CardTitle>
          <CardDescription>{t.settings.pinLock}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.settings.pinLock}</p>
              <p className="text-sm text-muted-foreground">{pin ? 'Faollashtirilgan' : 'Sondirilgan'}</p>
            </div>
            {pin ? (
              <Button variant="outline" onClick={handleDisablePin}>{t.settings.disablePin}</Button>
            ) : (
              <Button variant="outline" onClick={() => setIsSettingPin(true)}>{t.settings.enablePin}</Button>
            )}
          </div>
          
          {isSettingPin && !pin && (
            <div className="space-y-4 border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-4">
              <div className="space-y-2">
                <Label>{t.settings.enterPin}</Label>
                <Input 
                  type="password" 
                  maxLength={4} 
                  value={newPin} 
                  onChange={e => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="****"
                  className="max-w-[150px] text-center tracking-[0.5em] text-lg bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.settings.confirmPin}</Label>
                <Input 
                  type="password" 
                  maxLength={4} 
                  value={confirmPin} 
                  onChange={e => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="****"
                  className="max-w-[150px] text-center tracking-[0.5em] text-lg bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSetPin} disabled={newPin.length !== 4 || confirmPin.length !== 4}>
                  {t.common.save}
                </Button>
                <Button variant="ghost" onClick={() => { setIsSettingPin(false); setNewPin(''); setConfirmPin(''); }}>
                  {t.common.cancel}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/10">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">{t.settings.account}</CardTitle>
          <CardDescription className="text-red-600/70 dark:text-red-400/70">
            {t.settings.logoutDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            {t.common.logout}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
