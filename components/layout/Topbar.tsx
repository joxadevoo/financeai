'use client'

import { Menu, Bell, Moon, Sun, Search, LogOut, DollarSign, Coins } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useCurrencyStore } from '@/lib/store/useCurrencyStore'
import { useFamilyStore } from '@/lib/store/useFamilyStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { setTheme, theme } = useTheme()
  const { t } = useTranslation()
  const { currency, setCurrency, fetchRate } = useCurrencyStore()
  const { links, fetchLinks, acceptInvite, removeLink } = useFamilyStore()
  const supabase = createClient()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    fetchRate() // fetch live rate on load
    fetchLinks() // fetch family links for notifications
    const getUserData = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUserEmail(data.user.email ?? null)
      }
    }
    getUserData()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const pendingInvitesList = links.filter(l => 
    l.member_email.trim().toLowerCase() === userEmail?.trim().toLowerCase() && 
    l.status === 'pending'
  )
  const pendingInvites = pendingInvitesList.length

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b bg-background/80 backdrop-blur-md px-2 sm:px-4 shadow-sm lg:px-8">
      <div className="flex flex-1 items-center gap-x-4">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-neutral-700 md:hidden"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Search Input Container */}
        <div className="hidden md:flex flex-1 relative max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <Input 
            className="pl-9 bg-neutral-100 dark:bg-neutral-900 border-none w-full" 
            placeholder={t.common.search}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-x-1 sm:gap-x-4 lg:gap-x-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-neutral-600 dark:text-neutral-400"
            >
              <Bell className="h-5 w-5" />
              {pendingInvites > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-background"></span>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2">
            <DropdownMenuLabel className="font-semibold text-base">{t.common?.notifications || 'Bildirishnomalar'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {pendingInvitesList.length > 0 ? (
              <div className="max-h-[300px] overflow-y-auto">
                {pendingInvitesList.map(invite => (
                  <div key={invite.id} className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg mb-2 border">
                    <p className="text-sm mb-3">Sizni oilaviy guruhga vizual ulanishga taklif qilishdi!</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => acceptInvite(invite.id)}>
                        Qabul
                      </Button>
                      <Button size="sm" variant="outline" className="w-full text-red-600" onClick={() => removeLink(invite.id)}>
                        Rad
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-neutral-500">
                Sizda yangi xabarlar yo'q
              </div>
            )}
            {pendingInvitesList.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <Button variant="ghost" className="w-full text-xs" onClick={() => router.push('/family')}>
                  Barcha takliflarni ko'rish
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrency(currency === 'UZS' ? 'USD' : 'UZS')}
          className="text-neutral-600 dark:text-neutral-400 font-medium flex px-2"
        >
          {currency === 'UZS' ? <Coins className="h-4 w-4 sm:mr-1" /> : <DollarSign className="h-4 w-4 sm:mr-1" />}
          <span className="hidden sm:inline-block">{currency}</span>
        </Button>

        <LanguageSwitcher />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-neutral-600 dark:text-neutral-400"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <div className="hidden sm:block h-6 w-px bg-neutral-200 dark:bg-neutral-800" aria-hidden="true" />

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none"
          >
            <Avatar className="h-8 w-8 ring-2 ring-blue-500/20">
              <AvatarImage src="/placeholder-avatar.png" alt="User" />
              <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail || 'Loading...'}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              {t.common.settings}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950 dark:text-red-400" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t.common.logout}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
