'use client'

import { useChat } from '@ai-sdk/react'
import { ChatMessage } from './ChatMessage'
import { QuickQuestions } from './QuickQuestions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef } from 'react'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function ChatWindow() {
  const { t } = useTranslation()

  // @ts-ignore
  const chat = useChat({ api: '/api/ai' }) as any;
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = chat;
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleQuickQuestion = (question: string) => {
    append({
      role: 'user',
      content: question,
    })
  }

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="flex-1 p-4 md:p-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-8 mt-12">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-full">
              <SparklesIcon className="h-10 w-10 text-indigo-500" />
            </div>
            <div className="text-center max-w-md">
              <h3 className="text-xl font-semibold mb-2">{t.aiAdvisor.howCanIHelp}</h3>
              <p className="text-muted-foreground mb-8 text-sm">
                {t.aiAdvisor.whatICanDo}
              </p>
              <QuickQuestions onSelect={handleQuickQuestion} />
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-20">
            {(messages || []).map((m: any) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {isLoading && (messages || []).length > 0 && messages[messages.length - 1].role === 'user' && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.aiAdvisor.claudeIsThinking}
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>
        )}
      </ScrollArea>

      <div className="p-4 bg-background border-t border-neutral-200 dark:border-neutral-800 shrink-0">
        <form 
          onSubmit={handleSubmit} 
          className="relative max-w-4xl mx-auto flex items-center"
        >
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder={t.aiAdvisor.inputPlaceholder}
            className="pr-12 py-6 rounded-full bg-neutral-100 dark:bg-neutral-900 border-transparent focus-visible:ring-indigo-500"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !(input || '').trim()} 
            className="absolute right-2 rounded-full h-10 w-10 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-3">
          {t.aiAdvisor.disclaimer}
        </p>
      </div>
    </div>
  )
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  )
}
