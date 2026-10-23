import { Activity, CalendarDays, CheckCircle2 } from "lucide-react"
import DashboardSectionHeader from "./DashboardSectionHeader"

const distributionItems = [
  {
    key: "upcoming",
    label: "Upcoming",
    icon: CalendarDays,
    color: "text-[#087f82]",
    barColor: "bg-[#159b9b]",
  },
  {
    key: "active",
    label: "Active",
    icon: Activity,
    color: "text-[#198154]",
    barColor: "bg-[#36a675]",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle2,
    color: "text-[#5369b7]",
    barColor: "bg-[#7185d0]",
  },
]

function TripDistribution({ distribution, loading = false }) {
  return (
    <section
      aria-labelledby="trip-distribution-title"
      className="min-w-0 rounded-2xl border border-[#e1e7e3] bg-white p-5 shadow-[0_7px_25px_rgba(23,35,60,0.035)] sm:p-6"
    >
      <DashboardSectionHeader
        eyebrow="TRAVEL ANALYTICS"
        title="Your trip distribution"
        description="See how your trips are distributed across different stages."
      />

      <div className="space-y-6">
        {distributionItems.map((item) => {
          const Icon = item.icon

          const data = distribution?.[item.key] ?? {
            count: 0,
            percentage: 0,
          }

          const rawPercentage = Number(data.percentage)
          const percentage = Number.isFinite(rawPercentage)
            ? Math.min(100, Math.max(0, rawPercentage))
            : 0

          const count = Number(data.count)
          const safeCount = Number.isFinite(count)
            ? Math.max(0, count)
            : 0

          return (
            <div key={item.key}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#e1e7e3] bg-[#f7faf8]">
                    <Icon size={18} className={item.color} aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#17233c]">
                      {item.label}
                    </p>

                    <p className="mt-1 text-xs text-[#89959e]">
                      {loading
                        ? "Calculating..."
                        : `${safeCount} ${safeCount === 1 ? "trip" : "trips"}`}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 text-sm font-semibold text-[#52616f]">
                  {loading ? "—" : `${percentage}%`}
                </span>
              </div>

              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-[#edf1ee]"
                role="progressbar"
                aria-label={`${item.label} trip percentage`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={loading ? 0 : percentage}
                aria-valuetext={
                  loading ? "Calculating" : `${percentage}%`
                }
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                  style={{
                    width: loading ? "0%" : `${percentage}%`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default TripDistribution