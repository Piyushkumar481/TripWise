export const unwrapApiData = (response) => {
  let result = response

  // Support Axios response objects and ApiResponse wrappers.
  for (let i = 0; i < 3; i += 1) {
    if (
      result &&
      typeof result === "object" &&
      Object.prototype.hasOwnProperty.call(result, "data")
    ) {
      result = result.data
    } else {
      break
    }
  }

  return result
}

export const getExpenseTotal = (expenses = []) => {
  return expenses.reduce((total, expense) => {
    const amount = Number(expense?.amount)

    return total + (
      Number.isFinite(amount) && amount > 0
        ? amount
        : 0
    )
  }, 0)
}

export const getPackingPercentage = ({
  totalItems = 0,
  packedItems = 0,
} = {}) => {
  const total = Number(totalItems)
  const packed = Number(packedItems)

  if (
    !Number.isFinite(total) ||
    !Number.isFinite(packed) ||
    total <= 0
  ) {
    return 0
  }

  return Math.round(
    (Math.min(Math.max(packed, 0), total) / total) * 100
  )
}

export const formatTripCurrency = (amount) => {
  const value = Number(amount)

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)
}