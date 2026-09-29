import { useEffect, useState } from "react"
import { X } from "lucide-react"

function AddExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  trip,
  submitting = false,
  error = "",
}) {
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

    setFormData({
      title: "",
      amount: "",
      date: trip?.startDate || "",
      category: "",
      paymentMethod: "",
      notes: "",
    })

    setValidationError("")
  }, [isOpen, trip])

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

    if (!formData.amount || Number.isNaN(amount) || amount <= 0) {
      setValidationError("Amount must be greater than 0.")
      return
    }

    if (!formData.date) {
      setValidationError("Expense date is required.")
      return
    }

    if (
      trip?.startDate &&
      formData.date < trip.startDate
    ) {
      setValidationError(
        "Expense date must be within the trip dates."
      )
      return
    }

    if (
      trip?.endDate &&
      formData.date > trip.endDate
    ) {
      setValidationError(
        "Expense date must be within the trip dates."
      )
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
      paymentMethod:
        formData.paymentMethod.trim() || null,
      notes:
        formData.notes.trim() || null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 p-5 sm:p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-400">
              Expenses
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Add expense
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Record a cost from your trip.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close expense modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5 sm:p-6"
        >
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
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Title
            </label>

            <input
              id="expense-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Dinner at the beach"
              maxLength={150}
              disabled={submitting}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-60"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="expense-amount"
                className="mb-2 block text-sm font-medium text-slate-300"
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
                disabled={submitting}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="expense-date"
                className="mb-2 block text-sm font-medium text-slate-300"
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
                disabled={submitting}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="expense-category"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Category
              </label>

              <select
                id="expense-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={submitting}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-60"
              >
                <option value="" className="bg-slate-900">
                  Select category
                </option>
                <option value="Accommodation" className="bg-slate-900">
                  Accommodation
                </option>
                <option value="Food" className="bg-slate-900">
                  Food
                </option>
                <option value="Transport" className="bg-slate-900">
                  Transport
                </option>
                <option value="Activities" className="bg-slate-900">
                  Activities
                </option>
                <option value="Shopping" className="bg-slate-900">
                  Shopping
                </option>
                <option value="Other" className="bg-slate-900">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="expense-payment"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Payment method
              </label>

              <select
                id="expense-payment"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                disabled={submitting}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-60"
              >
                <option value="" className="bg-slate-900">
                  Select method
                </option>
                <option value="UPI" className="bg-slate-900">
                  UPI
                </option>
                <option value="Card" className="bg-slate-900">
                  Card
                </option>
                <option value="Cash" className="bg-slate-900">
                  Cash
                </option>
                <option value="Bank Transfer" className="bg-slate-900">
                  Bank Transfer
                </option>
                <option value="Other" className="bg-slate-900">
                  Other
                </option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="expense-notes"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Notes
            </label>

            <textarea
              id="expense-notes"
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              maxLength={1000}
              placeholder="Add any useful details..."
              disabled={submitting}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Add expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddExpenseModal
