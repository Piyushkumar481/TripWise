import { useEffect, useState } from "react"
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MapPin,
  Package,
  Wallet,
} from "lucide-react"
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom"

import { getTripById } from "../services/tripService"
import { getApiErrorMessage } from "../utils/errorHandler"
import {
  getTripStatus,
  getTripStatusStyles,
} from "../utils/tripUtils"

const workspaceItems = [
  {
    label: "Overview",
    path: "",
    icon: LayoutDashboard,
  },
  {
    label: "Itinerary",
    path: "itinerary",
    icon: CalendarDays,
  },
  {
    label: "Expenses",
    path: "expenses",
    icon: Wallet,
  },
  {
    label: "Documents",
    path: "documents",
    icon: FileText,
  },
  {
    label: "Packing",
    path: "packing",
    icon: Package,
  },
  {
    label: "Notes",
    path: "notes",
    icon: ClipboardList,
  },
]

function TripWorkspaceLayout() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isActive = true

    const fetchTrip = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await getTripById(id)

        if (!isActive) {
          return
        }

        setTrip(response?.data || null)
      } catch (error) {
        if (!isActive) {
          return
        }

        setError(
          getApiErrorMessage(
            error,
            "Unable to load this trip."
          )
        )
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    fetchTrip()

    return () => {
      isActive = false
    }
  }, [id])

  const status = trip
    ? getTripStatus(trip)
    : "UNKNOWN"

  const statusStyles = getTripStatusStyles(status)

  const formatDate = (date) => {
    if (!date) {
      return "Not specified"
    }

    const parsedDate = new Date(`${date}T00:00:00`)

    if (Number.isNaN(parsedDate.getTime())) {
      return date
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse rounded-3xl border border-[#e1e7e3] bg-white p-6 shadow-[0_7px_25px_rgba(23,35,60,0.035)] sm:p-8">
          <div className="h-4 w-24 rounded bg-[#e8eeeb]" />
          <div className="mt-6 h-8 w-64 rounded bg-[#e8eeeb]" />
          <div className="mt-3 h-4 w-40 rounded bg-[#e8eeeb]" />

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-20 rounded-2xl bg-[#f1f5f3]" />
            <div className="h-20 rounded-2xl bg-[#f1f5f3]" />
            <div className="h-20 rounded-2xl bg-[#f1f5f3]" />
          </div>
        </div>

        <div className="h-14 animate-pulse rounded-2xl bg-[#f1f5f3]" />
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-[#9f2d2d]">
          Unable to load trip
        </h2>

        <p className="mt-2 text-sm text-[#b54747]">
          {error || "Trip not found."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/trips")}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17233c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#243452]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trips
        </button>
      </div>
    )
  }

  const destination = [
    trip.destinationCity,
    trip.destinationCountry,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-[#dfe7e3] bg-gradient-to-br from-white via-white to-[#edf8f6] p-6 shadow-[0_10px_35px_rgba(23,35,60,0.05)] sm:p-8">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#5bc8c0]/10 blur-3xl" />

        <div className="relative">
          <button
            type="button"
            onClick={() => navigate("/trips")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#71808d] transition hover:text-[#087f82]"
          >
            <ArrowLeft className="h-4 w-4" />
            My Trips
          </button>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-2xl font-bold tracking-tight text-[#17233c] sm:text-3xl">
                  {trip.title}
                </h1>

                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles.badge}`}
                >
                  {statusStyles.label}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm text-[#71808d]">
                <MapPin className="h-4 w-4 text-[#087f82]" />

                <span>
                  {destination || "Destination not specified"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#e1e7e3] bg-white/80 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#89959e]">
                <CalendarDays className="h-4 w-4" />
                Travel Dates
              </div>

              <p className="mt-2 text-sm font-semibold text-[#17233c]">
                {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
              </p>
            </div>

            <div className="rounded-2xl border border-[#e1e7e3] bg-white/80 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#89959e]">
                <Wallet className="h-4 w-4" />
                Trip Budget
              </div>

              <p className="mt-2 text-sm font-semibold text-[#17233c]">
                {formatBudget(trip.budget)}
              </p>
            </div>

            <div className="rounded-2xl border border-[#e1e7e3] bg-white/80 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#89959e]">
                <LayoutDashboard className="h-4 w-4" />
                Workspace
              </div>

              <p className="mt-2 text-sm font-semibold text-[#17233c]">
                Trip planning hub
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-x-auto rounded-2xl border border-[#e1e7e3] bg-white shadow-[0_7px_25px_rgba(23,35,60,0.035)]">
        <nav className="flex min-w-max items-center gap-1 p-2">
          {workspaceItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.label}
                to={
                  item.path
                    ? `/trips/${id}/${item.path}`
                    : `/trips/${id}`
                }
                end={!item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#e8f7f5] text-[#087f82]"
                      : "text-[#71808d] hover:bg-[#f5f8f7] hover:text-[#17233c]"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div>
        <Outlet context={{ trip }} />
      </div>
    </div>
  )
}

export default TripWorkspaceLayout
