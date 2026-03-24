export type DebtType = 'lent' | 'borrowed'
export type DebtStatus = 'pending' | 'paid'

export interface Debt {
  id: string
  user_id: string
  type: DebtType
  amount: number
  person_name: string
  due_date: string | null
  status: DebtStatus
  created_at: string
}
