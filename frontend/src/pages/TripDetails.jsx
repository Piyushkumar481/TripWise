import { useMemo } from "react"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Package,
  Wallet,
} from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"

import {
  getTripStatus,
  getTripStatusStyles,
} from "../utils/tripUtils"

function TripDetails() {
  const { trip } = useOutletContext()
  const navigate = useNavigate()

  const status = getTripStatus(trip)
  const statusStyles = getTripStatusStyles(status)

  const tripStats = useMemo(() => {
    if (!trip?.startDate || !trip?.endDate) {
      return {
        duration: 0,
        daysRemaining: 0,
        progress: 0,
      }
    }

    const start = new Date(`${trip.startDate}T00:00:00`)
    const end = new Date(`${trip.endDate}T23:59:59`)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end < start
    ) {
      return {
        duration: 0,
        daysRemaining: 0,
        progress: 0,
      }
    }

    const totalDuration =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1

    let daysRemaining = 0
    let progress = 0

    if (today < start) {
      daysRemaining = Math.ceil(
        (start - today) / (1000 * 60 * 60 * 24)
      )
      progress = 0
    } else if (today > end) {
      daysRemaining = 0
      progress = 100
    } else {
      daysRemaining = Math.ceil(
        (end - today) / (1000 * 60 * 60 * 24)
      )

      const elapsedDays =
        Math.floor(
          (today - start) / (1000 * 60 * 60 * 24)
        ) + 1

      progress = Math.min(
        100,
        Math.max(
          0,
          Math.round(
            (elapsedDays / totalDuration) * 100
          )
        )
      )
    }

    return {
      duration: totalDuration,
      daysRemaining,
      progress,
    }
  }, [trip])

  const formatBudget = (budget) => {
    if (budget == null) {
      return "No budget"
    }

    const numericBudget = Number(budget)

    if (Number.isNaN(numericBudget)) {
      return "No budget"
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(numericBudget)
  }

  const formatDate = (date) => {
    if (!date) {
      return "Not set"
    }

    const parsedDate = new Date(`${date}T00:00:00`)

    if (Number.isNaN(parsedDate.getTime())) {
      return date
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    )
  }

  return (
    <div className="space-y-6">
      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#087f82]">
              Trip Overview
            </p>

            <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#17233c]">
              Your trip at a glance
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71808d]">
              Keep your travel plans, budget, documents and
              preparation in one place.
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles.badge}`}
          >
            {statusStyles.label}
          </span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewStatCard
          icon={CalendarDays}
          label="Duration"
          value={tripStats.duration}
          description={
            tripStats.duration === 1
              ? "day"
              : "days"
          }
        />

        <OverviewStatCard
          icon={Clock3}
          label="Remaining"
          value={tripStats.daysRemaining}
          description={
            tripStats.daysRemaining === 1
              ? "day left"
              : "days left"
          }
        />

        <OverviewStatCard
          icon={Wallet}
          label="Budget"
          value={formatBudget(trip.budget)}
          description="Planned trip budget"
        />

        <OverviewStatCard
          icon={MapPin}
          label="Destination"
          value={
            trip.destinationCity ||
            "Not specified"
          }
          description={
            trip.destinationCountry ||
            "Country not specified"
          }
        />
      </section>

      <section className="rounded-3xl border border-[#e1e7e3] bg-white p-6 shadow-[0_7px_25px_rgba(23,35,60,0.035)] sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#087f82]" />

              <h3 className="text-lg font-semibold text-[#17233c]">
                Trip progress
              </h3>
            </div>

            <p className="mt-2 text-sm text-[#71808d]">
              {status === "UPCOMING"
                ? "Your trip hasn't started yet."
                : status === "ACTIVE"
                  ? "You're currently on this trip."
                  : status === "COMPLETED"
                    ? "This trip has been completed."
                    : "Trip progress is unavailable."}
            </p>
          </div>

          <span className="text-2xl font-bold text-[#17233c]">
            {tripStats.progress}%
          </span>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#e8eeeb]">
          <div
            className="h-full rounded-full bg-[#087f82] transition-all duration-500"
            style={{
              width: `${tripStats.progress}%`,
            }}
          />
        </div>

        <div className="mt-3 flex justify-between text-xs text-[#89959e]">
          <span>{formatDate(trip.startDate)}</span>
          <span>{formatDate(trip.endDate)}</span>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#17233c]">
            Trip workspace
          </h3>

          <p className="mt-1 text-sm text-[#71808d]">
            Manage every part of your journey from one place.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <WorkspaceCard
            icon={CalendarDays}
            title="Itinerary"
            description="Plan activities and organize each day."
            onClick={() =>
              navigate(
                `/trips/${trip.id}/itinerary`
              )
            }
          />

          <WorkspaceCard
            icon={Wallet}
            title="Expenses"
            description="Track spending and stay within budget."
            onClick={() =>
              navigate(
                `/trips/${trip.id}/expenses`
              )
            }
          />

          <WorkspaceCard
            icon={FileText}
            title="Documents"
            description="Keep important travel documents organized."
            onClick={() =>
              navigate(
                `/trips/${trip.id}/documents`
              )
            }
          />

          <WorkspaceCard
            icon={Package}
            title="Packing"
            description="Prepare everything you need before leaving."
            onClick={() =>
              navigate(
                `/trips/${trip.id}/packing`
              )
            }
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <OverviewEmptyCard
          icon={CalendarDays}
          title="Upcoming itinerary"
          description="Your planned activities will appear here once you start building your itinerary."
          actionLabel="Plan itinerary"
          onClick={() =>
            navigate(
              `/trips/${trip.id}/itinerary`
            )
          }
        />

        <OverviewEmptyCard
          icon={Wallet}
          title="Expense summary"
          description="Your expense breakdown will appear here once you start tracking trip spending."
          actionLabel="Add expenses"
          onClick={() =>
            navigate(
              `/trips/${trip.id}/expenses`
            )
          }
        />
      </section>
    </div>
  )
}

function OverviewStatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-[#e1e7e3] bg-white p-5 shadow-[0_7px_25px_rgba(23,35,60,0.035)]">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-[#e8f7f5] p-2.5">
          <Icon className="h-5 w-5 text-[#087f82]" />
        </div>

        <span className="text-xs font-semibold text-[#89959e]">
          {label}
        </span>
      </div>

      <p className="mt-5 truncate text-2xl font-bold text-[#17233c]">
        {value}
      </p>

      <p className="mt-1 truncate text-sm text-[#71808d]">
        {description}
      </p>
    </div>
  )
}

function WorkspaceCard({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-[#e1e7e3] bg-white p-5 text-left shadow-[0_7px_25px_rgba(23,35,60,0.035)] transition hover:-translate-y-0.5 hover:border-[#b9dfda] hover:shadow-[0_10px_30px_rgba(23,35,60,0.06)]"
    >
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-[#e8f7f5] p-2.5">
          <Icon className="h-5 w-5 text-[#087f82]" />
        </div>

        <ArrowRight className="h-4 w-4 text-[#a4afb7] transition group-hover:translate-x-1 group-hover:text-[#087f82]" />
      </div>

      <h4 className="mt-5 font-semibold text-[#17233c]">
        {title}
      </h4>

      <p className="mt-2 text-sm leading-6 text-[#71808d]">
        {description}
      </p>
    </button>
  )
}

function OverviewEmptyCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  onClick,
}) {
  return (
    <div className="rounded-2xl border border-[#e1e7e3] bg-white p-6 shadow-[0_7px_25px_rgba(23,35,60,0.035)]">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-[#f1f5f3] p-3">
          <Icon className="h-5 w-5 text-[#71808d]" />
        </div>

        <div className="min-w-0">
          <h4 className="font-semibold text-[#17233c]">
            {title}
          </h4>

          <p className="mt-2 text-sm leading-6 text-[#71808d]">
            {description}
          </p>

          <button
            type="button"
            onClick={onClick}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#087f82] transition hover:text-[#065f62]"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TripDetails
