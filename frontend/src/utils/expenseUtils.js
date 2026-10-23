export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Accommodation",
  "Shopping",
  "Activities",
  "Other",
]

export const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Bank Transfer",
  "Other",
]

export const normalizeExpenseCategory = (category) => {
  if (!category || typeof category !== "string") {
    return "Other"
  }

  const normalized = category.trim().toLowerCase()

  const matchedCategory = EXPENSE_CATEGORIES.find(
    (item) => item.toLowerCase() === normalized
  )

  return matchedCategory || "Other"
}

export const calculateTotalExpenses = (expenses = []) => {
  return expenses.reduce((total, expense) => {
    const amount = Number(expense?.amount)

    return total + (
      Number.isFinite(amount) && amount > 0
        ? amount
        : 0
    )
  }, 0)
}

export const calculateCategoryTotals = (expenses = []) => {
  return expenses.reduce((totals, expense) => {
    const category = normalizeExpenseCategory(expense?.category)
    const amount = Number(expense?.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
      return totals
    }

    totals[category] = (totals[category] || 0) + amount

    return totals
  }, {})
}

export const formatExpenseCurrency = (amount) => {
  const value = Number(amount)

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0)
}
