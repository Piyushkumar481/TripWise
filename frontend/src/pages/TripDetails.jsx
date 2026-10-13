import { useCallback, useEffect, useMemo, useState } from "react"
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Luggage,
  MapPin,
  Package,
  Receipt,
  StickyNote,
  Wallet,
} from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"

import {
  getTripStatus,
  getTripStatusStyles,
} from "../utils/tripUtils"

import TripWorkspaceCard from "../components/trip/TripWorkspaceCard"
import TripWorkspaceSection from "../components/trip/TripWorkspaceSection"
import TripEmptyState from "../components/trip/TripEmptyState"
import TripWorkspaceSummaryCard from "../components/trip/TripWorkspaceSummaryCard"

import { getItinerary } from "../services/itineraryService"
import { getExpenses } from "../services/expenseService"
import { getPackingProgress } from "../services/packingService"
import { getTripNotesSummary } from "../services/tripNoteService"

import {
  formatTripCurrency,
  getExpenseTotal,
  getPackingPercentage,
  unwrapApiData,
} from "../utils/tripWorkspaceUtils"

import { getApiErrorMessage } from "../utils/errorHandler"

function TripDetails() {
  const { trip } = useOutletContext()
  const navigate = useNavigate()

  const status = getTripStatus(trip)
  const statusStyles = getTripStatusStyles(status)

  const [workspaceSummary, setWorkspaceSummary] = useState({
    itinerary: [],
    expenses: [],
    packing: {
      totalItems: 0,
      packedItems: 0,
      unpackedItems: 0,
      percentage: 0,
    },
    notes: {
      totalNotes: 0,
      pinnedNotes: 0,
      unpinnedNotes: 0,
    },
  })

  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState("")

  const loadWorkspaceSummary = useCallback(async () => {
    if (!trip.id) return

    setSummaryLoading(true)
    setSummaryError("")

    try {
      const results = await Promise.allSettled([
        getItinerary(trip.id),
        getExpenses(trip.id),
        getPackingProgress(trip.id),
        getTripNotesSummary(trip.id),
      ])

      const errors = []
      const [itineraryResult, expensesResult, packingResult, notesResult] =
        results

      let itinerary = []
      let expenses = []
      let packing = {
        totalItems: 0,
        packedItems: 0,
        unpackedItems: 0,
        percentage: 0,
      }
      let notes = {
        totalNotes: 0,
        pinnedNotes: 0,
        unpinnedNotes: 0,
      }

      if (itineraryResult.status === "fulfilled") {
        const data = unwrapApiData(itineraryResult.value)
        itinerary = Array.isArray(data) ? data : []
      } else {
        errors.push("itinerary")
      }

      if (expensesResult.status === "fulfilled") {
        const data = unwrapApiData(expensesResult.value)
        expenses = Array.isArray(data) ? data : []
      } else {
        errors.push("expenses")
      }

      if (packingResult.status === "fulfilled") {
        const data = unwrapApiData(packingResult.value)

        if (data && typeof data === "object") {
          packing = {
            totalItems: Number(data.totalItems) || 0,
            packedItems: Number(data.packedItems) || 0,
            unpackedItems: Number(data.unpackedItems) || 0,
            percentage: Number(data.percentage) || 0,
          }
        }
      } else {
        errors.push("packing")
      }

      if (notesResult.status === "fulfilled") {
        const data = unwrapApiData(notesResult.value)

        if (data && typeof data === "object") {
          notes = {
            totalNotes: Number(data.totalNotes) || 0,
            pinnedNotes: Number(data.pinnedNotes) || 0,
            unpinnedNotes: Number(data.unpinnedNotes) || 0,
          }
        }
      } else {
        errors.push("notes")
      }

      setWorkspaceSummary({
        itinerary,
        expenses,
        packing,
        notes,
      })

      if (errors.length > 0) {
        setSummaryError(
          `Some workspace summaries could not be loaded: ${errors.join(", ")}.`
        )
      }
    } catch (error) {
      setSummaryError(getApiErrorMessage(error, "Unable to load trip overview."))
    } finally {
      setSummaryLoading(false)
    }
  }, [trip.id])

  useEffect(() => {
    let active = true

    const loadInitialSummary = async () => {
      setSummaryLoading(true)
      setSummaryError("")

      try {
        const results = await Promise.allSettled([
          getItinerary(trip.id),
          getExpenses(trip.id),
          getPackingProgress(trip.id),
          getTripNotesSummary(trip.id),
        ])

        if (!active) return

        const errors = []
        const [itineraryResult, expensesResult, packingResult, notesResult] =
          results

        let itinerary = []
        let expenses = []
        let packing = {
          totalItems: 0,
          packedItems: 0,
          unpackedItems: 0,
          percentage: 0,
        }
        let notes = {
          totalNotes: 0,
          pinnedNotes: 0,
          unpinnedNotes: 0,
        }

        if (itineraryResult.status === "fulfilled") {
          const data = unwrapApiData(itineraryResult.value)
          itinerary = Array.isArray(data) ? data : []
        } else {
          errors.push("itinerary")
        }

        if (expensesResult.status === "fulfilled") {
          const data = unwrapApiData(expensesResult.value)
          expenses = Array.isArray(data) ? data : []
        } else {
          errors.push("expenses")
        }

        if (packingResult.status === "fulfilled") {
          const data = unwrapApiData(packingResult.value)

          if (data && typeof data === "object") {
            packing = {
              totalItems: Number(data.totalItems) || 0,
              packedItems: Number(data.packedItems) || 0,
              unpackedItems: Number(data.unpackedItems) || 0,
              percentage: Number(data.percentage) || 0,
            }
          }
        } else {
          errors.push("packing")
        }

        if (notesResult.status === "fulfilled") {
          const data = unwrapApiData(notesResult.value)

          if (data && typeof data === "object") {
            notes = {
              totalNotes: Number(data.totalNotes) || 0,
              pinnedNotes: Number(data.pinnedNotes) || 0,
              unpinnedNotes: Number(data.unpinnedNotes) || 0,
            }
          }
        } else {
          errors.push("notes")
        }

        setWorkspaceSummary({
          itinerary,
          expenses,
          packing,
          notes,
        })

        if (errors.length > 0) {
          setSummaryError(
            `Some workspace summaries could not be loaded: ${errors.join(", ")}.`
          )
        }
      } catch (error) {
        if (active) {
          setSummaryError(
            getApiErrorMessage(error, "Unable to load trip overview.")
          )
        }
      } finally {
        if (active) {
          setSummaryLoading(false)
        }
      }
    }

    loadInitialSummary()

    return () => {
      active = false
    }
  }, [trip.id])
  const itineraryCount = workspaceSummary.itinerary.length
  const totalExpenses = getExpenseTotal(workspaceSummary.expenses)
  const packingPercentage = getPackingPercentage(workspaceSummary.packing)
  const noteCount = workspaceSummary.notes.totalNotes
  const pinnedNoteCount = workspaceSummary.notes.pinnedNotes
  const tripBudget = Number(trip?.budget) || 0
  const remainingBudget = tripBudget - totalExpenses

  const budgetUsedPercentage =
    tripBudget > 0
      ? Math.min(100, Math.round((totalExpenses / tripBudget) * 100))
      : null

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

    let daysRemaining
    let progress

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

      <TripWorkspaceSection
        eyebrow="YOUR TRIP AT A GLANCE"
        title="Workspace overview"
        description="See what's planned, spent, packed, and saved for this trip."
        action={
          <button
            type="button"
            onClick={loadWorkspaceSummary}
            disabled={summaryLoading}
            className="rounded-xl border border-[#e1e7e3] px-3 py-2 text-sm text-[#71808d] transition hover:bg-[#e8f7f5] hover:text-[#087f82] disabled:opacity-50"
          >
            {summaryLoading ? "Refreshing..." : "Refresh overview"}
          </button>
        }
      >
        {summaryError && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800"
          >
            <p>{summaryError}</p>
            <button
              type="button"
              onClick={loadWorkspaceSummary}
              disabled={summaryLoading}
              className="mt-2 font-medium underline underline-offset-4 disabled:opacity-50"
            >
              Try again
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <TripWorkspaceSummaryCard
            icon={CalendarDays}
            title="Itinerary"
            value={`${itineraryCount} ${itineraryCount === 1 ? "activity" : "activities"}`}
            description="Activities scheduled for this trip."
            loading={summaryLoading}
            onAction={() => navigate(`/trips/${trip.id}/itinerary`)}
          />

          <TripWorkspaceSummaryCard
            icon={Receipt}
            title="Expenses"
            value={formatTripCurrency(totalExpenses)}
            description={
              tripBudget > 0
                ? `${formatTripCurrency(remainingBudget)} remaining from your budget.`
                : "Set a trip budget to track your remaining funds."
            }
            progress={
              budgetUsedPercentage === null
                ? undefined
                : budgetUsedPercentage
            }
            loading={summaryLoading}
            onAction={() => navigate(`/trips/${trip.id}/expenses`)}
          />

          <TripWorkspaceSummaryCard
            icon={Luggage}
            title="Packing"
            value={`${workspaceSummary.packing.packedItems}/${workspaceSummary.packing.totalItems}`}
            description={`${workspaceSummary.packing.unpackedItems} items still to pack.`}
            progress={packingPercentage}
            loading={summaryLoading}
            onAction={() => navigate(`/trips/${trip.id}/packing`)}
          />

          <TripWorkspaceSummaryCard
            icon={StickyNote}
            title="Notes"
            value={String(noteCount)}
            description={`${pinnedNoteCount} pinned ${pinnedNoteCount === 1 ? "note" : "notes"}.`}
            loading={summaryLoading}
            onAction={() => navigate(`/trips/${trip.id}/notes`)}
          />
        </div>
      </TripWorkspaceSection>

      <TripWorkspaceSection
        eyebrow="Workspace"
        title="Manage your journey"
        description="Manage every part of your journey from one place."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TripWorkspaceCard
            icon={CalendarDays}
            title="Itinerary"
            description="Plan activities and organize each day."
            onClick={() =>
              navigate(`/trips/${trip.id}/itinerary`)
            }
          />

          <TripWorkspaceCard
            icon={Wallet}
            title="Expenses"
            description="Track spending and stay within budget."
            onClick={() =>
              navigate(`/trips/${trip.id}/expenses`)
            }
          />

          <TripWorkspaceCard
            icon={FileText}
            title="Documents"
            description="Keep important travel documents organized."
            onClick={() =>
              navigate(`/trips/${trip.id}/documents`)
            }
          />

          <TripWorkspaceCard
            icon={Package}
            title="Packing"
            description="Prepare everything you need before leaving."
            onClick={() =>
              navigate(`/trips/${trip.id}/packing`)
            }
          />
        </div>
      </TripWorkspaceSection>

      <section className="grid gap-4 lg:grid-cols-2">
        <TripEmptyState
          icon={CalendarDays}
          title="Upcoming itinerary"
          description="Your planned activities will appear here once you start building your itinerary."
          actionLabel="Plan itinerary"
          onAction={() =>
            navigate(`/trips/${trip.id}/itinerary`)
          }
        />

        <TripEmptyState
          icon={Wallet}
          title="Expense summary"
          description="Your expense breakdown will appear here once you start tracking trip spending."
          actionLabel="Add expenses"
          onAction={() =>
            navigate(`/trips/${trip.id}/expenses`)
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

export default TripDetails



