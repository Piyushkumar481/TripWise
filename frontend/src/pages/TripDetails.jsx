import { useEffect, useState } from "react"

import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit3,
  Globe2,
  MapPin,
  MoreVertical,
  Trash2,
  Wallet,
} from "lucide-react"

import { useNavigate, useParams } from "react-router-dom"

import api from "../services/api"
import { deleteTrip } from "../services/tripService"
import { getApiErrorMessage } from "../utils/errorHandler"
import { getTripStatus, getTripStatusStyles } from "../utils/tripUtils"
import ConfirmModal from "../components/ConfirmModal"

function TripDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    const loadTrip = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await api.get(`/api/trips/${id}`)

        setTrip(response.data.data)
      } catch (error) {
        console.error("Failed to load trip:", error)

        setError(
          getApiErrorMessage(
            error,
            "Unable to load this trip."
          )
        )
      } finally {
        setLoading(false)
      }
    }

    loadTrip()
  }, [id])

  const handleDeleteTrip = async () => {
    setDeleting(true)
    setDeleteError("")

    try {
      await deleteTrip(id)

      navigate("/trips", {
        replace: true,
      })
    } catch (error) {
      setDeleteError(
        getApiErrorMessage(
          error,
          "Unable to delete this trip. Please try again."
        )
      )
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return "Not set"

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    )
  }

  const formatBudget = (budget) => {
    if (budget === null || budget === undefined) {
      return "Not set"
    }

    return `Rs. ${Number(budget).toLocaleString("en-IN")}`
  }


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 animate-pulse rounded bg-[#e9eeeb]" />

        <div className="h-[320px] animate-pulse rounded-[28px] bg-[#e9eeeb]" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="h-32 animate-pulse rounded-2xl bg-[#e9eeeb]" />
          <div className="h-32 animate-pulse rounded-2xl bg-[#e9eeeb]" />
          <div className="h-32 animate-pulse rounded-2xl bg-[#e9eeeb]" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[24px] border border-[#f1cbc5] bg-[#fff1ef] p-6">
        <p className="text-sm text-[#c96556]">
          {error}
        </p>

        <button
          type="button"
          onClick={() => navigate("/trips")}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#e2d4d1] bg-white px-4 py-2.5 text-sm font-bold text-[#687583] transition hover:bg-[#fffaf9] hover:text-[#17233c]"
        >
          <ArrowLeft size={16} />
          Back to trips
        </button>
      </div>
    )
  }

  if (!trip) {
    return null
  }

  const destination =
    [trip.destinationCity, trip.destinationCountry]
      .filter(Boolean)
      .join(", ") || "Destination not set"

  const tripStatus = getTripStatus(trip)
  const tripStatusStyles = getTripStatusStyles(tripStatus)

  return (
    <div className="mx-auto max-w-[1450px] space-y-7">

      <button
        type="button"
        onClick={() => navigate("/trips")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#7b8794] transition hover:text-[#087f82]"
      >
        <ArrowLeft size={17} />
        Back to trips
      </button>

      <section className="relative overflow-hidden rounded-[28px] border border-[#dce8e4] bg-[#edf8f6]">

        <div className="absolute inset-0 bg-gradient-to-br from-[#d5eee9] via-[#edf8f6] to-[#f5eadb]" />

        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#cde9e4]/70" />

        <div className="absolute -bottom-32 right-48 h-64 w-64 rounded-full bg-[#f3dfc7]/60" />

        <div className="relative z-10 flex min-h-[320px] flex-col justify-end p-7 sm:p-9 lg:p-11">

          <div className="flex flex-wrap items-center gap-3">

            <span
              className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${tripStatusStyles.badge}`}
            >
              {tripStatusStyles.label}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/65 px-3 py-1.5 text-xs font-semibold text-[#687583] backdrop-blur-sm">
              <MapPin
                size={13}
                className="text-[#159b9b]"
              />
              {destination}
            </span>

          </div>

          <h1 className="mt-4 max-w-3xl font-serif text-[38px] font-bold leading-[1.05] tracking-[-0.04em] text-[#17233c] sm:text-[48px] lg:text-[54px]">
            {trip.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-[#687987]">

            <span className="inline-flex items-center gap-2">
              <CalendarDays
                size={16}
                className="text-[#159b9b]"
              />

              {formatDate(trip.startDate)}
              {" - "}
              {formatDate(trip.endDate)}
            </span>

          </div>

        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={() =>
            navigate(`/trips/${trip.id}/edit`)
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dfe5e1] bg-white px-5 py-3 text-sm font-bold text-[#687583] shadow-[0_5px_18px_rgba(23,35,60,0.03)] transition hover:border-[#b9dcd7] hover:bg-[#eaf7f5] hover:text-[#087f82]"
        >
          <Edit3 size={17} />
          Edit trip
        </button>

        <button
          type="button"
          onClick={() => {
            setDeleteError("")
            setDeleteModalOpen(true)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-500 transition hover:border-red-300 hover:bg-red-100 hover:text-red-600"
        >
          <Trash2 size={17} />
          Delete trip
        </button>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dfe5e1] bg-white px-4 py-3 text-[#7b8794] shadow-[0_5px_18px_rgba(23,35,60,0.03)] transition hover:border-[#d5dcd8] hover:text-[#17233c]"
          aria-label="More trip options"
        >
          <MoreVertical size={18} />
        </button>

      </div>

      <section>

        <div className="mb-5">
          <h2 className="font-serif text-[28px] font-bold tracking-tight text-[#17233c]">
            Trip overview
          </h2>

          <p className="mt-1.5 text-sm text-[#7b8794]">
            The essentials for your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-[#e1e7e3] bg-white p-5 shadow-[0_7px_25px_rgba(23,35,60,0.035)]">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f7f5] text-[#159b9b]">
              <Globe2 size={21} />
            </div>

            <p className="mt-5 text-sm text-[#89949d]">
              Destination
            </p>

            <p className="mt-1 text-lg font-bold text-[#17233c]">
              {destination}
            </p>

          </div>

          <div className="rounded-2xl border border-[#e1e7e3] bg-white p-5 shadow-[0_7px_25px_rgba(23,35,60,0.035)]">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eeefff] text-[#6572c8]">
              <CalendarDays size={21} />
            </div>

            <p className="mt-5 text-sm text-[#89949d]">
              Travel dates
            </p>

            <p className="mt-1 text-sm font-bold text-[#17233c]">
              {formatDate(trip.startDate)}
            </p>

            <p className="mt-1 text-xs text-[#929da5]">
              until {formatDate(trip.endDate)}
            </p>

          </div>

          <div className="rounded-2xl border border-[#e1e7e3] bg-white p-5 shadow-[0_7px_25px_rgba(23,35,60,0.035)]">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf9f1] text-[#198154]">
              <Wallet size={21} />
            </div>

            <p className="mt-5 text-sm text-[#89949d]">
              Planned budget
            </p>

            <p className="mt-1 text-lg font-bold text-[#17233c]">
              {formatBudget(trip.budget)}
            </p>

          </div>

        </div>

      </section>

      <section>

        <div className="mb-5">
          <h2 className="font-serif text-[28px] font-bold tracking-tight text-[#17233c]">
            Trip workspace
          </h2>

          <p className="mt-1.5 text-sm text-[#7b8794]">
            Everything you will need to organize this journey.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <WorkspaceCard
            icon={<CalendarDays size={21} />}
            title="Itinerary"
            description="Plan each day of your trip."
            iconClass="bg-[#e8f7f5] text-[#159b9b]"
          />

          <WorkspaceCard
            icon={<Wallet size={21} />}
            title="Expenses"
            description="Track your travel spending."
            iconClass="bg-[#fff0ec] text-[#ed735e]"
          />

          <WorkspaceCard
            icon={<Clock3 size={21} />}
            title="Documents"
            description="Keep important files together."
            iconClass="bg-[#eeefff] text-[#6572c8]"
          />

          <WorkspaceCard
            icon={<MapPin size={21} />}
            title="Packing"
            description="Build your packing checklist."
            iconClass="bg-[#e8f2ff] text-[#3786d9]"
          />

        </div>

      </section>

      {deleteError && (
        <div className="fixed bottom-6 left-1/2 z-[110] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 shadow-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span>{deleteError}</span>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete this trip?"
        message={
          trip
            ? `You're about to permanently delete "${trip.title}". All information associated with this trip will no longer be available.`
            : "You're about to permanently delete this trip."
        }
        confirmText="Delete Trip"
        cancelText="Keep Trip"
        loading={deleting}
        onCancel={() => {
          if (!deleting) {
            setDeleteModalOpen(false)
          }
        }}
        onConfirm={handleDeleteTrip}
      />

    </div>
  )
}

function WorkspaceCard({
  icon,
  title,
  description,
  iconClass,
}) {
  return (
    <button
      type="button"
      className="group rounded-2xl border border-[#e1e7e3] bg-white p-5 text-left shadow-[0_7px_25px_rgba(23,35,60,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#c5ded9] hover:shadow-[0_14px_30px_rgba(23,35,60,0.07)]"
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <h3 className="mt-5 font-bold text-[#17233c]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-5 text-[#71808d]">
        {description}
      </p>
    </button>
  )
}

export default TripDetails
