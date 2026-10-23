import {
  ArrowRight,
  CalendarDays,
  Compass,
  MapPin,
  Sparkles,
} from "lucide-react"

import {
  formatAnalyticsDate,
  formatAnalyticsCurrency,
  getDaysUntilTrip,
} from "../../utils/dashboardAnalytics"

function DashboardInsights({
  analytics,
  onOpenTrip,
  onViewTrips,
  loading = false,
}) {
  const nextTrip = analytics?.nextTrip
  const destination = analytics?.mostPlannedDestination

  const daysUntilTrip = nextTrip
    ? getDaysUntilTrip(nextTrip.startDate)
    : null

  const nextDestination = [
    nextTrip?.destinationCity,
    nextTrip?.destinationCountry,
  ]
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => value.trim())
    .join(", ")

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#087f82]">
          SMART TRAVEL OVERVIEW
        </p>

        <h2 className="mt-2 text-xl font-semibold text-[#17233c]">
          Your travel insights
        </h2>

        <p className="mt-1 text-sm text-[#71808d]">
          A quick look at what is ahead and how you are planning.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article className="relative overflow-hidden rounded-2xl border border-[#b9dfda] bg-gradient-to-br from-[#eaf8f6] via-white to-white p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[#159b9b]/10 blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 text-[#087f82]">
              <CalendarDays size={18} />

              <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                Next adventure
              </span>
            </div>

            {loading ? (
              <div className="mt-6 animate-pulse space-y-3" role="status">
                <div className="h-6 w-2/3 rounded bg-[#dcebe7]" />
                <div className="h-4 w-1/2 rounded bg-[#edf3f0]" />
                <span className="sr-only">Loading next trip</span>
              </div>
            ) : nextTrip ? (
              <>
                <h3 className="mt-5 break-words text-xl font-semibold text-[#17233c]">
                  {nextTrip.title || "Your upcoming trip"}
                </h3>

                <p className="mt-2 flex items-center gap-2 text-sm text-[#52616f]">
                  <MapPin size={16} className="shrink-0 text-[#087f82]" />
                  {nextDestination || "Destination not specified"}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-[#b9dfda] bg-white px-3 py-1.5 text-xs font-medium text-[#087f82]">
                    {formatAnalyticsDate(nextTrip.startDate)}
                  </span>

                  {daysUntilTrip !== null && (
                    <span className="text-sm text-[#71808d]">
                      {daysUntilTrip === 0
                        ? "Starts today"
                        : `In ${daysUntilTrip} ${
                            daysUntilTrip === 1 ? "day" : "days"
                          }`}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onOpenTrip?.(nextTrip)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#087f82] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#06696c] focus:outline-none focus:ring-2 focus:ring-[#087f82]/40"
                >
                  View trip
                  <ArrowRight size={16} />
                </button>
              </>
            ) : (
              <>
                <h3 className="mt-5 text-lg font-semibold text-[#17233c]">
                  Ready for another adventure?
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-[#71808d]">
                  You do not have an upcoming trip yet. Start planning your
                  next destination.
                </p>

                <button
                  type="button"
                  onClick={onViewTrips}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#dce3df] px-4 py-2.5 text-sm font-medium text-[#52616f] transition hover:bg-[#f4f8f5] focus:outline-none focus:ring-2 focus:ring-[#087f82]/40"
                >
                  Explore your trips
                  <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-[#e1e7e3] bg-white p-5 shadow-[0_7px_25px_rgba(23,35,60,0.035)] sm:p-6">
          <div className="flex items-center gap-2 text-[#a16b16]">
            <Compass size={18} />

            <span className="text-xs font-semibold uppercase tracking-[0.15em]">
              Destination insight
            </span>
          </div>

          {loading ? (
            <div className="mt-6 animate-pulse space-y-3" role="status">
              <div className="h-6 w-2/3 rounded bg-[#e8eeeb]" />
              <div className="h-4 w-1/2 rounded bg-[#f0f3f1]" />
              <span className="sr-only">Loading destination insight</span>
            </div>
          ) : destination ? (
            <>
              <h3 className="mt-5 break-words text-xl font-semibold text-[#17233c]">
                {destination.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#71808d]">
                Your most frequently planned destination based on the trips
                currently saved in TripWise.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl border border-[#f0e2c5] bg-[#fff9ed] text-[#a16b16]">
                  <Sparkles size={20} />
                </div>

                <div>
                  <p className="text-lg font-semibold text-[#17233c]">
                    {destination.count}
                  </p>

                  <p className="text-xs text-[#89959e]">
                    {destination.count === 1 ? "Planned trip" : "Planned trips"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="mt-5 text-lg font-semibold text-[#17233c]">
                Your next destination awaits
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#71808d]">
                Add a destination to one of your trips to start seeing
                personalized travel insights.
              </p>
            </>
          )}

          <div className="mt-6 flex items-center gap-2 text-xs text-[#89959e]">
            <Sparkles size={14} />
            <span>Insights update from your saved trip data.</span>
          </div>
        </article>

        <article className="rounded-2xl border border-[#e1e7e3] bg-white p-5 shadow-[0_7px_25px_rgba(23,35,60,0.035)] sm:p-6 xl:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl border border-[#b9dfda] bg-[#eaf8f6] text-[#087f82]">
              <Sparkles size={20} />
            </div>

            <div>
              <h3 className="font-semibold text-[#17233c]">
                Your travel budget
              </h3>

              <p className="mt-1 text-sm text-[#71808d]">
                The combined planned budgets of your saved trips.
              </p>
            </div>
          </div>

          <p className="mt-5 text-3xl font-semibold tracking-tight text-[#17233c]">
            {loading
              ? "—"
              : formatAnalyticsCurrency(analytics?.totalBudget ?? 0)}
          </p>

          <p className="mt-2 text-sm text-[#89959e]">
            This is your total allocated trip budget, not actual spending.
            Actual expenses are tracked within each trip.
          </p>
        </article>
      </div>
    </section>
  )
}

export default DashboardInsights