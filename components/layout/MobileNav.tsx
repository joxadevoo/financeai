'use client'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-72 h-[100dvh]">
        <Sidebar onItemClick={onClose} />
      </SheetContent>
    </Sheet>
  )
}
