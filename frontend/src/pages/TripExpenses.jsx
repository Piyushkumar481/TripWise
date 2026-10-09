import { useEffect, useState } from "react"
import {
  Pencil,
  Receipt,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { useOutletContext, useParams } from "react-router-dom"

import ConfirmModal from "../components/ConfirmModal"
import AddExpenseModal from "../components/trip/AddExpenseModal"
import ExpenseSummary from "../components/trip/ExpenseSummary"
import ExpenseCategoryBreakdown from "../components/trip/ExpenseCategoryBreakdown"
import TripEmptyState from "../components/trip/TripEmptyState"
import TripModulePage from "../components/trip/TripModulePage"
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../services/expenseService"
import { getApiErrorMessage } from "../utils/errorHandler"

function TripExpenses() {
  const { id } = useParams()
  const { trip } = useOutletContext()

  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [editingExpense, setEditingExpense] = useState(null)
  const [deletingExpense, setDeletingExpense] = useState(null)
  const [deleteError, setDeleteError] = useState("")
  const [deleting, setDeleting] = useState(false)

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

  const handleSubmitExpense = async (expenseData) => {
    try {
      setSubmitting(true)
      setSubmitError("")

      if (editingExpense) {
        const response = await updateExpense(
          id,
          editingExpense.id,
          expenseData
        )

        const updatedExpense = response.data

        setExpenses((currentExpenses) =>
          currentExpenses
            .map((expense) =>
              expense.id === updatedExpense.id
                ? updatedExpense
                : expense
            )
            .sort((a, b) =>
              a.date.localeCompare(b.date)
            )
        )
      } else {
        const response = await createExpense(
          id,
          expenseData
        )

        const createdExpense = response.data

        setExpenses((currentExpenses) =>
          [...currentExpenses, createdExpense].sort(
            (a, b) =>
              a.date.localeCompare(b.date)
          )
        )
      }

      setIsModalOpen(false)
      setEditingExpense(null)
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          editingExpense
            ? "Unable to update this expense."
            : "Unable to add this expense."
        )
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditExpense = (expense) => {
    setSubmitError("")
    setEditingExpense(expense)
    setIsModalOpen(true)
  }

  const handleDeleteExpense = async () => {
    if (!deletingExpense) {
      return
    }

    try {
      setDeleting(true)
      setDeleteError("")

      await deleteExpense(
        id,
        deletingExpense.id
      )

      setExpenses((currentExpenses) =>
        currentExpenses.filter(
          (expense) =>
            expense.id !== deletingExpense.id
        )
      )

      setDeletingExpense(null)
    } catch (error) {
      setDeleteError(
        getApiErrorMessage(
          error,
          "Unable to delete this expense."
        )
      )
    } finally {
      setDeleting(false)
    }
  }

  const openExpenseModal = () => {
    setSubmitError("")
    setEditingExpense(null)
    setIsModalOpen(true)
  }

  const closeExpenseModal = () => {
    if (submitting) {
      return
    }

    setIsModalOpen(false)
    setEditingExpense(null)
    setSubmitError("")
  }

  const openDeleteConfirmation = (expense) => {
    setDeleteError("")
    setDeletingExpense(expense)
  }

  const closeDeleteConfirmation = () => {
    if (deleting) {
      return
    }

    setDeletingExpense(null)
    setDeleteError("")
  }

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

      {!loading && !error && (
        <div className="space-y-6">
          <ExpenseSummary expenses={expenses} trip={trip} />
          <ExpenseCategoryBreakdown expenses={expenses} />

          {expenses.length > 0 ? (
            <>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={openExpenseModal}
                  className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  + Add expense
                </button>
              </div>

              <ExpenseList
                expenses={expenses}
                onEdit={handleEditExpense}
                onDelete={openDeleteConfirmation}
              />
            </>
          ) : (
            <TripEmptyState
              icon={Receipt}
              title="No expenses yet"
              description="Your spending summary will update automatically when you record your first trip expense."
              actionLabel="Add expense"
              onAction={openExpenseModal}
            />
          )}
        </div>
      )}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={closeExpenseModal}
        onSubmit={handleSubmitExpense}
        trip={trip}
        submitting={submitting}
        error={submitError}
        editingExpense={editingExpense}
      />

      {deleteError && (
        <div className="fixed bottom-6 right-6 z-[110] max-w-sm rounded-2xl border border-red-400/20 bg-slate-900 px-4 py-3 text-sm text-red-300 shadow-2xl">
          {deleteError}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deletingExpense)}
        onCancel={closeDeleteConfirmation}
        onConfirm={handleDeleteExpense}
        title="Delete expense?"
        message={
          deletingExpense
            ? `Are you sure you want to delete "${deletingExpense.title}"?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
      />
    </TripModulePage>
  )
}

function ExpenseList({
  expenses,
  onEdit,
  onDelete,
}) {
  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <article
          key={expense.id}
          className="rounded-2xl border border-[#d9e5e2] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b9dfda] hover:shadow-[0_12px_30px_rgba(15,23,42,0.10)]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-900">
                  {expense.title}
                </h3>

                <span className="rounded-full border border-[#d7e5e2] bg-[#f1f8f6] px-2.5 py-1 text-[11px] font-medium text-[#087f82]">
                  {expense.category}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                {formatExpenseDate(expense.date)}
              </p>

              {expense.paymentMethod && (
                <p className="mt-2 text-xs text-slate-600">
                  Paid via {expense.paymentMethod}
                </p>
              )}

              {expense.notes && (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {expense.notes}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-start gap-2">
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(expense.amount)}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(expense)}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-[#eef8f6] hover:text-[#087f82]"
                  aria-label={`Edit ${expense.title}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(expense)}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                  aria-label={`Delete ${expense.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function formatExpenseDate(date) {
  if (!date) {
    return "No date"
  }

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



