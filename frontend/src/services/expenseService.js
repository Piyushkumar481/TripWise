import api from "./api"

export const getExpenses = async (tripId) => {
  const response = await api.get(
    `/api/trips/${tripId}/expenses`
  )

  return response.data
}

export const createExpense = async (
  tripId,
  expenseData
) => {
  const response = await api.post(
    `/api/trips/${tripId}/expenses`,
    expenseData
  )

  return response.data
}

export const updateExpense = async (
  tripId,
  expenseId,
  expenseData
) => {
  const response = await api.put(
    `/api/trips/${tripId}/expenses/${expenseId}`,
    expenseData
  )

  return response.data
}

export const deleteExpense = async (
  tripId,
  expenseId
) => {
  const response = await api.delete(
    `/api/trips/${tripId}/expenses/${expenseId}`
  )

  return response
}
