import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'

export const maxDuration = 30 // Set max duration for API Route

const SYSTEM_PROMPT = `You are FinanceAI, a professional, empathetic, and highly knowledgeable personal finance advisor. 
You provide specific, actionable advice based on the user's financial situations.
Communicate clearly, use bullet points where helpful, and avoid medical or legal advice.
You can help with budgeting, saving, debt reduction, and understanding investing basics.
Respond in the language the user speaks (frequently Uzbek or English).
Format your outputs clearly with markdown.`

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    
    // Require authentication
    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { messages } = await req.json()

    const result = await streamText({
      model: anthropic('claude-3-5-sonnet-20240620'), // Compatible model name mapping in Vercel AI SDK
      system: SYSTEM_PROMPT,
      messages,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Error in AI route:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
