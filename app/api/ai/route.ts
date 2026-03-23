import { openai } from '@ai-sdk/openai'
import { streamText, convertToModelMessages } from 'ai'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'

export const maxDuration = 30

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
    if (!user) return new Response('Unauthorized', { status: 401 })

    // Parallel fetch - har birini o'zining o'zgaruvchisida saqlaymiz
    const profileQ    = supabase.from('profiles').select('full_name, currency').eq('id', user.id).maybeSingle()
    const incomesQ    = supabase.from('income_sources').select('name, amount, type, frequency, is_active').eq('user_id', user.id)
    const expensesQ   = supabase.from('expenses').select('name, amount, category, date').eq('user_id', user.id).order('date', { ascending: false }).limit(50)
    const budgetQ     = supabase.from('budget_settings').select('rule_type, necessities_pct, wants_pct, savings_pct').eq('user_id', user.id).maybeSingle()
    const emergencyQ  = supabase.from('emergency_fund').select('current_amount, target_months').eq('user_id', user.id).maybeSingle()
    const investmentsQ = supabase.from('investments').select('name, type, initial_amount, monthly_contribution, annual_rate').eq('user_id', user.id)

    const [profileR, incomesR, expensesR, budgetR, emergencyR, investmentsR] = await Promise.all([
      profileQ, incomesQ, expensesQ, budgetQ, emergencyQ, investmentsQ,
    ])

    type ProfileRow    = Database['public']['Tables']['profiles']['Row']
    type IncomeRow     = Database['public']['Tables']['income_sources']['Row']
    type ExpenseRow    = Database['public']['Tables']['expenses']['Row']
    type BudgetRow     = Database['public']['Tables']['budget_settings']['Row']
    type EmergencyRow  = Database['public']['Tables']['emergency_fund']['Row']
    type InvestmentRow = Database['public']['Tables']['investments']['Row']

    const profile     = profileR.data     as ProfileRow | null
    const incomes     = (incomesR.data    as IncomeRow[]     | null) ?? []
    const expenses    = (expensesR.data   as ExpenseRow[]    | null) ?? []
    const budget      = budgetR.data      as BudgetRow | null
    const emergency   = emergencyR.data   as EmergencyRow | null
    const investments = (investmentsR.data as InvestmentRow[] | null) ?? []

    const currency = profile?.currency ?? 'UZS'
    const userName = profile?.full_name ?? 'Foydalanuvchi'

    // Oylik daromad
    const activeIncomes = incomes.filter(i => i.is_active !== false)
    const totalMonthlyIncome = activeIncomes.reduce((sum, i) => {
      let m = i.amount
      if (i.frequency === 'yearly') m = i.amount / 12
      if (i.frequency === 'weekly') m = i.amount * 4
      return sum + m
    }, 0)

    // Bu oylik xarajatlar
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const thisMonth = expenses.filter(e => e.date != null && e.date >= firstOfMonth)
    const totalExpenses = thisMonth.reduce((sum, e) => sum + e.amount, 0)

    const byCategory: Record<string, number> = {}
    for (const e of thisMonth) {
      byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount
    }
    const categoryBreakdown = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amt]) => `  - ${cat}: ${amt.toLocaleString()} ${currency}`)
      .join('\n') || `  Bu oy xarajat yo'q`

    const incomeSummary = activeIncomes.length > 0
      ? activeIncomes.map(i => `  - ${i.name}: ${i.amount.toLocaleString()} ${currency} (${i.frequency ?? 'oylik'})`).join('\n')
      : `  Ma'lumot yo'q`

    const investSummary = investments.length > 0
      ? investments.map(inv =>
          `  - ${inv.name} (${inv.type}): ${(inv.initial_amount ?? 0).toLocaleString()}, oylik +${(inv.monthly_contribution ?? 0).toLocaleString()}, ${inv.annual_rate ?? 0}%`
        ).join('\n')
      : `  Investitsiya yo'q`

    const budgetInfo = budget
      ? `${budget.rule_type ?? '—'}: zaruriyat ${budget.necessities_pct}%, xohish ${budget.wants_pct}%, jamg'arma ${budget.savings_pct}%`
      : `Byudjet sozlanmagan`

    const emergencyInfo = emergency
      ? `Joriy: ${(emergency.current_amount ?? 0).toLocaleString()} ${currency} | Maqsad: ${emergency.target_months ?? 3} oy`
      : `Ma'lumot yo'q`

    const systemPrompt = `You are FinanceAI — a professional and empathetic personal finance advisor for ${userName}.
You have access to their REAL, LIVE financial data. Always give SPECIFIC, PERSONALIZED advice using exact numbers from the data below.
Respond in the language the user writes in (Uzbek or English). Format clearly with markdown.

=== ${userName.toUpperCase()}NING HAQIQIY MOLIYAVIY HOLATI ===

💰 DAROMADLAR — oylik jami: ${totalMonthlyIncome.toLocaleString()} ${currency}
${incomeSummary}

💸 BU OY XARAJATLAR — jami: ${totalExpenses.toLocaleString()} ${currency}
${categoryBreakdown}

📊 BYUDJET TARTIBI: ${budgetInfo}

🆘 FAVQULODDA JAMG'ARMA: ${emergencyInfo}

📈 INVESTITSIYALAR:
${investSummary}

📉 OYLIK SALDO: ${(totalMonthlyIncome - totalExpenses).toLocaleString()} ${currency}
==========================================
Always reference these exact numbers. Ask for more info if needed.`

    const { messages } = await req.json()
    const modelMessages = await convertToModelMessages(messages)

    const result = await streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages: modelMessages,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Error in AI route:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
