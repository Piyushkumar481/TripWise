import { useEffect, useState } from "react"
import { Receipt, RefreshCw } from "lucide-react"
import { useOutletContext, useParams } from "react-router-dom"

import TripModulePage from "../components/trip/TripModulePage"
import TripEmptyState from "../components/trip/TripEmptyState"
import { getExpenses } from "../services/expenseService"
import { getApiErrorMessage } from "../utils/errorHandler"

function TripExpenses() {
  const { id } = useParams()
  useOutletContext()

  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadExpenses = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await getExpenses(id)

      setExpenses(response?.data || [])
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Unable to load expenses."
        )
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadExpenses()
    }
  }, [id])

  return (
    <TripModulePage
      icon={Receipt}
      eyebrow="Expenses"
      title="Track your trip spending"
      description="Keep every trip expense organized in one place and stay aware of where your budget is going."
    >
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-6 text-center">
          <p className="text-sm text-red-300">
            {error}
          </p>

          <button
            type="button"
            onClick={loadExpenses}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        expenses.length === 0 && (
          <TripEmptyState
            icon={Receipt}
            title="No expenses yet"
            description="Start tracking your trip spending by adding your first expense."
            actionLabel="Add expense"
            onAction={() => {}}
          />
        )}

      {!loading &&
        !error &&
        expenses.length > 0 && (
          <ExpenseList expenses={expenses} />
        )}
    </TripModulePage>
  )
}

function ExpenseList({ expenses }) {
  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <article
          key={expense.id}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.04]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-white">
                  {expense.title}
                </h3>

                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-400">
                  {expense.category}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {formatExpenseDate(expense.date)}
              </p>

              {expense.paymentMethod && (
                <p className="mt-2 text-xs text-slate-500">
                  Paid via {expense.paymentMethod}
                </p>
              )}

              {expense.notes && (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {expense.notes}
                </p>
              )}
            </div>

            <div className="shrink-0">
              <p className="text-lg font-bold text-white">
                {formatCurrency(expense.amount)}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function formatExpenseDate(date) {
  if (!date) return "No date"

  const parsedDate = new Date(`${date}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) {
    return "No date"
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatCurrency(amount) {
  if (amount === null || amount === undefined) {
    return "?0.00"
  }

  const numericAmount = Number(amount)

  if (Number.isNaN(numericAmount)) {
    return "?0.00"
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numericAmount)
}

export default TripExpenses
