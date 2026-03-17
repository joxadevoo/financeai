'use client'


import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sparkles, User } from 'lucide-react'

interface ChatMessageProps {
  message: any
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAi = message.role === 'assistant'

  return (
    <div className={`flex gap-4 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
      <Avatar className={`h-8 w-8 shrink-0 ${isAi ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
        {isAi ? (
          <AvatarFallback className="bg-transparent"><Sparkles className="h-4 w-4" /></AvatarFallback>
        ) : (
          <AvatarFallback className="bg-transparent"><User className="h-4 w-4" /></AvatarFallback>
        )}
      </Avatar>

      <div 
        className={`flex-1 overflow-hidden px-4 py-3 rounded-2xl max-w-[85%] ${
          isAi 
            ? 'bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-tl-sm' 
            : 'bg-indigo-600 text-white rounded-tr-sm self-end'
        }`}
      >
        <div 
          className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap"
          /* We would use a markdown renderer here in production, 
             but for simplicity we'll just render text or simple formatting */
        >
          {message.content}
        </div>
      </div>
    </div>
  )
}
