'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { Search, Calculator, Target, PiggyBank, CreditCard, LayoutDashboard, BrainCircuit, Repeat, FileText } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { language } = useTranslation()

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    []
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm pt-[20vh] px-4">
      <div 
        className="fixed inset-0 z-[-1]" 
        onClick={() => setOpen(false)} 
      />
      <Command 
        className="max-w-2xl mx-auto bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[400px]"
        label="Global Command Menu"
      >
        <div className="flex items-center px-4 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="h-5 w-5 text-neutral-400 shrink-0" />
          <Command.Input 
            autoFocus 
            placeholder={language === 'uz' ? "Nimani qidiryapsiz? (Masalan: /goals)" : "Type a command or search..."} 
            className="flex-1 bg-transparent border-0 py-4 px-3 text-sm outline-none placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 font-mono text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
             ESC
          </kbd>
        </div>

        <Command.List className="overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-neutral-500">
            {language === 'uz' ? 'Hech narsa topilmadi.' : 'No results found.'}
          </Command.Empty>

          <Command.Group heading={language === 'uz' ? "Asosiy Sahifalar" : "Main Pages"} className="text-xs text-neutral-500 px-2 font-medium mb-1 mt-2">
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/dashboard'))}
              className="flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 dark:text-neutral-200 rounded-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" /> Bosh sahifa (Dashboard)
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/report'))}
              className="flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 dark:text-neutral-200 rounded-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <FileText className="h-4 w-4" /> AI Smart Hisobot (Report)
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/expenses'))}
              className="flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 dark:text-neutral-200 rounded-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <CreditCard className="h-4 w-4" /> Xarajatlar (Expenses)
            </Command.Item>
          </Command.Group>

          <Command.Separator className="h-px bg-neutral-200 dark:bg-neutral-800 my-2" />

          <Command.Group heading={language === 'uz' ? "Rejalashtirish" : "Planning"} className="text-xs text-neutral-500 px-2 font-medium mb-1 mt-2">
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/goals'))}
              className="flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 dark:text-neutral-200 rounded-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Target className="h-4 w-4" /> Moliyaviy Maqsadlar (Goals)
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/budget'))}
              className="flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 dark:text-neutral-200 rounded-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Calculator className="h-4 w-4" /> Byudjet (Budget)
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/subscriptions'))}
              className="flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 dark:text-neutral-200 rounded-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Repeat className="h-4 w-4" /> Obunalar (Subscriptions)
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  )
}
