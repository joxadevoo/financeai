'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sparkles, User, Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ChatMessageProps {
  message: any
}

function getMessageText(message: any): string {
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((p: any) => p.type === 'text')
      .map((p: any) => p.text)
      .join('')
  }
  return message.content ?? ''
}

// GPT \[...\] → $$...$$ va \(...\) → $...$ ga o'giradi
function preprocessMath(text: string): string {
  return text
    .replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, math) => `$$${math}$$`)
    .replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_, math) => `$${math}$`)
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAi = message.role === 'assistant'
  const raw = getMessageText(message)
  const text = isAi ? preprocessMath(raw) : raw
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Nusxa olindi!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(prev => prev === type ? null : type)
    if (feedback !== type) {
      toast.success(type === 'up' ? 'Rahmat! 👍' : 'Tushundik, yaxshilashga harakat qilamiz.')
    }
  }

  return (
    <div className={`flex gap-4 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
      <Avatar className={`h-8 w-8 shrink-0 ${isAi ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
        {isAi ? (
          <AvatarFallback className="bg-transparent"><Sparkles className="h-4 w-4" /></AvatarFallback>
        ) : (
          <AvatarFallback className="bg-transparent"><User className="h-4 w-4" /></AvatarFallback>
        )}
      </Avatar>

      <div className={`flex flex-col gap-1.5 max-w-[85%] ${!isAi && 'items-end'}`}>
        <div
          className={`overflow-hidden px-4 py-3 rounded-2xl ${
            isAi
              ? 'bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-tl-sm'
              : 'bg-indigo-600 text-white rounded-tr-sm'
          }`}
        >
          {isAi ? (
            <div className="prose prose-sm max-w-none dark:prose-invert
              prose-headings:font-semibold prose-headings:text-foreground
              prose-h1:text-base prose-h2:text-sm prose-h3:text-sm
              prose-p:text-sm prose-p:leading-relaxed prose-p:text-foreground
              prose-li:text-sm prose-li:text-foreground
              prose-strong:font-semibold prose-strong:text-foreground
              prose-code:text-xs prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800
              prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-800 prose-pre:rounded-lg
              prose-a:text-indigo-500 prose-a:no-underline hover:prose-a:underline
              prose-ul:list-disc prose-ol:list-decimal prose-li:my-0.5
            ">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >{text}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
          )}
        </div>

        {/* Action buttons - only for AI messages */}
        {isAi && text && (
          <div className="flex items-center gap-0.5 px-1">
            {/* Copy */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
              onClick={handleCopy}
              title="Nusxa olish"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>

            {/* Thumbs up */}
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 transition-colors ${
                feedback === 'up'
                  ? 'text-emerald-500 hover:text-emerald-600'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
              onClick={() => handleFeedback('up')}
              title="Yaxshi javob"
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${feedback === 'up' ? 'fill-emerald-500' : ''}`} />
            </Button>

            {/* Thumbs down */}
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 transition-colors ${
                feedback === 'down'
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
              onClick={() => handleFeedback('down')}
              title="Yomon javob"
            >
              <ThumbsDown className={`h-3.5 w-3.5 ${feedback === 'down' ? 'fill-red-500' : ''}`} />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
