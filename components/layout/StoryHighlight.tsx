'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { StoryViewer } from '@/components/report/StoryViewer'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useProfileStore } from '@/lib/store/useProfileStore'

export function StoryHighlight() {
  const [showStory, setShowStory] = useState(false)
  const { language } = useTranslation()
  const { profile } = useProfileStore()
  
  // Instagram style unread story ring: gradient from purple to orange
  const ringStyle = "p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 cursor-pointer hover:scale-105 transition-transform"

  return (
    <>
      <div 
        className={ringStyle}
        onClick={() => setShowStory(true)}
        title={language === 'uz' ? "Mening hikoyam" : "My Story"}
      >
        <div className="bg-background rounded-full p-[2px]">
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
             <AvatarImage src="/placeholder-avatar.png" />
             <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-bold text-xs relative">
               ST
               <Sparkles className="absolute -bottom-1 -right-1 w-3 h-3 text-amber-500 animate-pulse" />
             </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <AnimatePresence>
        {showStory && <StoryViewer onClose={() => setShowStory(false)} />}
      </AnimatePresence>
    </>
  )
}
