import {
  Wallet,
  TrendingDown,
  Receipt,
  CircleDollarSign,
} from "lucide-react"

function ExpenseSummary({ expenses = [], trip }) {
  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  )

  const budget = Number(trip?.budget || 0)
  const remaining = budget - totalSpent
  const budgetUsed = budget > 0 ? (totalSpent / budget) * 100 : 0
  const progressWidth = Math.min(Math.max(budgetUsed, 0), 100)

  const metrics = [
    {
      label: "Trip Budget",
      value: formatCurrency(budget),
      icon: Wallet,
      description: "Your planned spending limit",
    },
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      icon: Receipt,
      description: `${expenses.length} recorded expenses`,
    },
    {
      label: "Remaining",
      value: formatCurrency(remaining),
      icon: CircleDollarSign,
      description:
        budget <= 0
          ? "No budget has been set"
          : remaining < 0
            ? "You are over budget"
            : "Available budget",
    },
    {
      label: "Budget Used",
      value: budget > 0 ? `${budgetUsed.toFixed(1)}%` : "—",
      icon: TrendingDown,
      description:
        budget > 0
          ? "Of your total trip budget"
          : "No budget has been set",
    },
  ]

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const isOverBudget =
            metric.label === "Remaining" && remaining < 0 && budget > 0

          return (
            <article
              key={metric.label}
              className="rounded-2xl border border-[#d9e5e2] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600">
                  {metric.label}
                </span>

                <div className="rounded-xl bg-[#eef8f6] p-2 text-[#087f82]">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <p
                className={`mt-4 break-words text-2xl font-bold ${
                  isOverBudget ? "text-red-600" : "text-slate-900"
                }`}
              >
                {metric.value}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {metric.description}
              </p>
            </article>
          )
        })}
      </div>

      <section className="rounded-2xl border border-[#d9e5e2] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900">
              Budget progress
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              {budget > 0
                ? `${formatCurrency(totalSpent)} spent out of ${formatCurrency(budget)}`
                : "Set a trip budget to track your spending progress."}
            </p>
          </div>

          {budget > 0 && (
            <span
              className={`text-sm font-semibold ${
                budgetUsed > 100 ? "text-red-600" : "text-[#087f82]"
              }`}
            >
              {budgetUsed.toFixed(1)}%
            </span>
          )}
        </div>

        <div
          className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-label="Trip budget used"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(Math.max(budgetUsed, 0), 100)}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetUsed > 100
                ? "bg-red-500"
                : budgetUsed >= 80
                  ? "bg-amber-400"
                  : "bg-[#25a89d]"
            }`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        {budget > 0 && budgetUsed > 100 && (
          <p className="mt-3 text-sm font-medium text-red-600">
            You've exceeded your trip budget by{" "}
            {formatCurrency(totalSpent - budget)}.
          </p>
        )}
      </section>
    </div>
  )
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount)
}

export default ExpenseSummary

