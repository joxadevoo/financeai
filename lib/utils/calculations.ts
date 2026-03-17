export function calculateTotalIncome(incomes: { amount: number }[]) {
  return incomes.reduce((acc, current) => acc + Number(current.amount), 0)
}

export function calculateTotalExpenses(expenses: { amount: number }[]) {
  return expenses.reduce((acc, current) => acc + Number(current.amount), 0)
}

export function calculateFinancialScore(totalIncome: number, totalExpenses: number, savingsAmount: number) {
  if (totalIncome === 0) return 0
  
  const savingsRate = (savingsAmount / totalIncome) * 100
  const expenseRatio = (totalExpenses / totalIncome) * 100
  
  // Basic scoring logic (0-100)
  let score = 50
  
  if (savingsRate >= 20) score += 20
  else if (savingsRate >= 10) score += 10
  
  if (expenseRatio <= 50) score += 20
  else if (expenseRatio <= 80) score += 10
  else score -= 20
  
  return Math.max(0, Math.min(100, score))
}

export function calculateCompoundInterest(
  principal: number, 
  monthlyContribution: number, 
  annualRate: number, 
  years: number
) {
  const r = annualRate / 100 / 12
  const n = years * 12
  
  // Future Value of a Series formula
  const futureValuePrincipal = principal * Math.pow(1 + r, n)
  const futureValueContributions = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r)
  
  return futureValuePrincipal + futureValueContributions
}
