export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline?: string
  color: string
  icon: string
  created_at?: string
}
