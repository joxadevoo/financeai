'use server'

import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

export async function extractExpenseAction(prompt: string) {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      system: 'You are an AI assistant parsing expense natural language inputs into structured JSON data. Return the amount as a number (in the currency mentioned or UZS default), the name of the expense, and categorize it strictly into one of: Housing, Food, Transport, Utilities, Dining, Healthcare, Entertainment, Other. Extract the date if mentioned (ISO format YYYY-MM-DD), otherwise null.',
      prompt,
      schema: z.object({
        amount: z.number().describe('The amount of the expense without currency symbols'),
        name: z.string().describe('Short description or name of what was bought'),
        category: z.enum(['Housing', 'Food', 'Transport', 'Utilities', 'Dining', 'Healthcare', 'Entertainment', 'Other']),
        date: z.string().nullable().describe('ISO date string (YYYY-MM-DD) if specified, otherwise null')
      })
    })

    return { success: true, data: object }
  } catch (error) {
    console.error('AI Extraction Error:', error)
    return { success: false, error: 'Failed to process AI request' }
  }
}

import { generateText } from 'ai'

export async function generateFinancialReportAction(dataStr: string) {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      system: 'You are professional Financial Advisor AI for a modern Personal Finance startup app. The user has requested a monthly financial report. Analyze the provided structured financial data (Income, Expenses, Goals). Write a concise, incredibly insightful, and encouraging report in MARKDOWN format. The report should highlight good habits, warn about overspending in specific categories, and give 2 clear actionable goals for the next month. Respond in Uzbek language by default unless data implies English. Keep it structured with modern styling (use bullets, emojis).',
      prompt: `Here is the user's financial data for the current month: ${dataStr}`,
    })
    
    return { success: true, report: text }
  } catch (error) {
    console.error("AI Report Generation Error:", error)
    return { success: false, error: 'Failed to generate report' }
  }
}

export async function parseReceiptAction(base64Image: string) {
  try {
    // Determine mime type from base64 string
    const match = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) throw new Error('Invalid image format');
    
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      system: 'You are an AI that extracts expense data from receipt images. Extract the final TOTAL amount as a number, a short name/description (e.g. the store name), the category (Housing, Food, Transport, Utilities, Dining, Healthcare, Entertainment, Other), and the date (YYYY-MM-DD) if visible. Currency is usually UZS but just return the number. If no category fits perfectly, default to Other. Be accurate.',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract the expense details from this receipt.' },
            { type: 'image', image: match[2] } // AI SDK expects raw base64 or URL depending on setup. Pass base64 string part only, or Buffer
          ]
        }
      ],
      schema: z.object({
        amount: z.number().describe('The total final amount of the expense without currency symbols'),
        name: z.string().describe('Short description or store name (e.g., Korzinka, Makro)'),
        category: z.enum(['Housing', 'Food', 'Transport', 'Utilities', 'Dining', 'Healthcare', 'Entertainment', 'Other']),
        date: z.string().nullable().describe('ISO date string (YYYY-MM-DD) if specified, otherwise null')
      })
    })

    return { success: true, data: object }
  } catch (error) {
    console.error('AI Receipt Parse Error:', error)
    return { success: false, error: 'Failed to process receipt' }
  }
}
