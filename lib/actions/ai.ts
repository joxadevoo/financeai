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
