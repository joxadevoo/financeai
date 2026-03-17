'use client'

import { Bell, Menu, Moon, Sun, Search, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslation } from '@/lib/i18n/useTranslation'
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
  const supabase = createClient()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
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
      
      <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
        <Button variant="ghost" size="icon" className="relative text-neutral-600 dark:text-neutral-400">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
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
