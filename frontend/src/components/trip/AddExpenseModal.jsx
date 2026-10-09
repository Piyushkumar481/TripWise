import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "../../utils/expenseUtils"

function AddExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  trip,
  submitting = false,
  error = "",
  editingExpense,
}) {
  const isEditing = Boolean(editingExpense)

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: trip?.startDate || "",
    category: "",
    paymentMethod: "",
    notes: "",
  })

  const [validationError, setValidationError] = useState("")

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (editingExpense) {
      setFormData({
        title: editingExpense.title || "",
        amount:
          editingExpense.amount !== null &&
          editingExpense.amount !== undefined
            ? String(editingExpense.amount)
            : "",
        date: editingExpense.date || trip?.startDate || "",
        category: editingExpense.category || "",
        paymentMethod: editingExpense.paymentMethod || "",
        notes: editingExpense.notes || "",
      })
    } else {
      setFormData({
        title: "",
        amount: "",
        date: trip?.startDate || "",
        category: "",
        paymentMethod: "",
        notes: "",
      })
    }

    setValidationError("")
  }, [isOpen, editingExpense, trip])

  if (!isOpen) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setValidationError("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const title = formData.title.trim()
    const category = formData.category.trim()
    const amount = Number(formData.amount)

    if (!title) {
      setValidationError("Expense title is required.")
      return
    }

    if (
      formData.amount === "" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setValidationError("Enter a valid expense amount greater than zero.")
      return
    }

    if (!formData.date) {
      setValidationError("Expense date is required.")
      return
    }

    if (trip?.startDate && formData.date < trip.startDate) {
      setValidationError("Expense date must be within the trip dates.")
      return
    }

    if (trip?.endDate && formData.date > trip.endDate) {
      setValidationError("Expense date must be within the trip dates.")
      return
    }

    if (!category) {
      setValidationError("Category is required.")
      return
    }

    await onSubmit({
      title,
      amount: formData.amount,
      date: formData.date,
      category,
      paymentMethod: formData.paymentMethod.trim() || null,
      notes: formData.notes.trim() || null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Expenses
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              {isEditing ? "Edit expense" : "Add expense"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {isEditing
                ? "Update the details of this expense."
                : "Record a cost from your trip."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close expense modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {(validationError || error) && (
            <div
              role="alert"
              className="rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300"
            >
              {validationError || error}
            </div>
          )}

          <div>
            <label
              htmlFor="expense-title"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Title
            </label>

            <input
              id="expense-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              maxLength={150}
              placeholder="e.g. Dinner"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="expense-amount"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Amount
              </label>

              <input
                id="expense-amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            <div>
              <label
                htmlFor="expense-date"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Date
              </label>

              <input
                id="expense-date"
                name="date"
                type="date"
                min={trip?.startDate || undefined}
                max={trip?.endDate || undefined}
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="expense-category"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Category
              </label>

              <select
                id="expense-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              >
                <option value="" className="bg-slate-900 text-white">Select a category</option>
                {EXPENSE_CATEGORIES.map((category) => (
                  <option key={category} value={category} className="bg-slate-900 text-white">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="expense-payment-method"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Payment method
              </label>

              <select
                id="expense-payment-method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              >
                <option value="" className="bg-slate-900 text-white">Select payment method</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method} className="bg-slate-900 text-white">
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="expense-notes"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Notes
            </label>

            <textarea
              id="expense-notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              maxLength={1000}
              rows={4}
              placeholder="Optional notes"
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Add expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddExpenseModal



