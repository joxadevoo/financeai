'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ChatMessage } from './ChatMessage'
import { QuickQuestions } from './QuickQuestions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { toast } from 'sonner'
import { Lightbulb } from 'lucide-react'

const STORAGE_KEY = 'finai-chat-history'

export function ChatWindow() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')

  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/ai' }), [])
  const { messages, sendMessage, status, setMessages } = useChat({ transport })
  const isLoading = status === 'streaming' || status === 'submitted'

  // Mount bo'lgandan keyin localStorage dan yuklash (SSR hydration muammosi bo'lmasin)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.length > 0) setMessages(parsed)
      }
    } catch {}
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Har yangi xabar kelganda saqlash
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

  const scrollWrapperRef = useRef<HTMLDivElement>(null)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = scrollWrapperRef.current
    if (!wrapper) return
    const viewport = wrapper.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement | null
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    sendMessage({ text })
  }

  const handleQuickQuestion = (question: string) => {
    if (isLoading) return
    sendMessage({ text: question })
  }

  const suggestions = [
    t.aiAdvisor.suggestion1,
    t.aiAdvisor.suggestion2,
    t.aiAdvisor.suggestion3,
    t.aiAdvisor.suggestion4
  ]

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
    toast.success('Chat tarixi tozalandi')
  }

  return (
    <div ref={scrollWrapperRef} className="flex flex-col h-full w-full overflow-hidden">
      <ScrollArea className="flex-1 min-h-0 p-4 md:p-6">
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

      <div className="p-3 sm:p-4 bg-background border-t border-neutral-200 dark:border-neutral-800 shrink-0">
        {messages.length > 0 && !isLoading && (
          <div className="max-w-4xl mx-auto mb-3 flex overflow-x-auto pb-2 gap-2 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(s)}
                className="flex flex-shrink-0 items-center gap-1.5 px-3 py-1.5 text-[11px] sm:text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-full transition-colors font-medium border border-indigo-100 dark:border-indigo-800/50 whitespace-nowrap"
              >
                <Lightbulb className="w-3 h-3" />
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="relative max-w-4xl mx-auto flex items-end gap-2">
          {messages.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="shrink-0 h-[52px] w-[40px] text-neutral-400 hover:text-red-500 rounded-xl"
              title="Tarixni tozalash"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.aiAdvisor.inputPlaceholder}
              className="pr-12 w-full min-h-[52px] py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border-transparent focus-visible:ring-indigo-500 text-sm sm:text-base whitespace-normal break-words"
              disabled={isLoading}
            />
            <Button
              type="button"
              size="icon"
              disabled={isLoading || !input.trim()}
              onClick={handleSend}
              className="absolute right-1.5 bottom-1.5 rounded-full h-[40px] w-[40px] bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
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
