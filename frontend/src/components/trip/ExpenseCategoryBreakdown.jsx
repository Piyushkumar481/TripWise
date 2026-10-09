import {
  Utensils,
  Car,
  Hotel,
  ShoppingBag,
  Ticket,
  CircleDollarSign,
  TrendingUp,
  ChartNoAxesColumnIncreasing,
} from "lucide-react"

const CATEGORY_CONFIG = {
  Food: {
    icon: Utensils,
    color: "bg-orange-500",
    textColor: "text-orange-600",
    background: "bg-orange-50",
  },
  Transport: {
    icon: Car,
    color: "bg-sky-500",
    textColor: "text-sky-600",
    background: "bg-sky-50",
  },
  Accommodation: {
    icon: Hotel,
    color: "bg-violet-500",
    textColor: "text-violet-600",
    background: "bg-violet-50",
  },
  Shopping: {
    icon: ShoppingBag,
    color: "bg-pink-500",
    textColor: "text-pink-600",
    background: "bg-pink-50",
  },
  Activities: {
    icon: Ticket,
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    background: "bg-emerald-50",
  },
  Other: {
    icon: CircleDollarSign,
    color: "bg-cyan-500",
    textColor: "text-cyan-600",
    background: "bg-cyan-50",
  },
}

const DEFAULT_CONFIG = {
  icon: CircleDollarSign,
  color: "bg-slate-500",
  textColor: "text-slate-600",
  background: "bg-slate-100",
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount)
}

function ExpenseCategoryBreakdown({ expenses = [] }) {
  const categoryTotals = expenses.reduce((totals, expense) => {
    const category = expense.category?.trim() || "Other"
    const amount = Number(expense.amount) || 0

    totals[category] = (totals[category] || 0) + amount

    return totals
  }, {})

  const totalSpent = expenses.reduce(
    (total, expense) => total + (Number(expense.amount) || 0),
    0
  )

  const categories = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
      config: CATEGORY_CONFIG[name] || DEFAULT_CONFIG,
    }))
    .sort((a, b) => b.amount - a.amount)

  const highestCategory = categories[0]

  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <section className="rounded-2xl border border-[#d9e5e2] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
              Spending analysis
            </p>

            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              Expense categories
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              See how your spending is distributed.
            </p>
          </div>

          <div className="rounded-xl border border-teal-100 bg-teal-50 p-3 text-teal-700">
            <ChartNoAxesColumnIncreasing className="h-5 w-5" />
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
            <ChartNoAxesColumnIncreasing className="mx-auto h-8 w-8 text-slate-400" />

            <p className="mt-3 font-medium text-slate-800">
              No spending data yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add an expense to see your category breakdown.
            </p>
          </div>
        ) : (
          <div className="mt-7 space-y-6">
            {categories.map((category) => {
              const Icon = category.config.icon

              return (
                <div key={category.name}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`rounded-xl p-2 ${category.config.background} ${category.config.textColor}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {category.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {category.percentage.toFixed(1)}% of spending
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-slate-900">
                      {formatCurrency(category.amount)}
                    </p>
                  </div>

                  <div
                    className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label={`${category.name} spending`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.min(category.percentage, 100)}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${category.config.color}`}
                      style={{
                        width: `${Math.min(category.percentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#d9e5e2] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
            <TrendingUp className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Spending insights
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              A quick look at your spending habits.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Total recorded spending
          </p>

          <p className="mt-2 break-words text-2xl font-bold text-slate-900">
            {formatCurrency(totalSpent)}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Across {expenses.length}{" "}
            {expenses.length === 1 ? "expense" : "expenses"}
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Highest spending category
          </p>

          {highestCategory ? (
            <>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {highestCategory.name}
              </p>

              <p className="mt-1 text-sm font-semibold text-teal-700">
                {formatCurrency(highestCategory.amount)}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {highestCategory.percentage.toFixed(1)}% of your recorded
                spending
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              Add expenses to discover your biggest spending category.
            </p>
          )}
        </div>

        <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50 p-4">
          <p className="text-sm font-semibold text-teal-800">
            Smart tip
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {highestCategory
              ? `Your highest recorded spending is on ${highestCategory.name.toLowerCase()}. Review these expenses when planning your next trip.`
              : "Record your trip expenses to discover spending patterns and make better travel budgets."}
          </p>
        </div>
      </section>
    </div>
  )
}

export default ExpenseCategoryBreakdown
