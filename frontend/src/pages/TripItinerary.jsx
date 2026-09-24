import { useEffect, useMemo, useState } from "react"
import {
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react"
import { useOutletContext, useParams } from "react-router-dom"

import TripEmptyState from "../components/trip/TripEmptyState"
import TripModulePage from "../components/trip/TripModulePage"
import { getItinerary } from "../services/itineraryService"
import { getApiErrorMessage } from "../utils/errorHandler"

function TripItinerary() {
  const { id } = useParams()
  const { trip } = useOutletContext()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isActive = true

    const fetchItinerary = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await getItinerary(id)

        if (!isActive) return

        setItems(response?.data || [])
      } catch (error) {
        if (!isActive) return

        setError(
          getApiErrorMessage(
            error,
            "Unable to load your itinerary."
          )
        )
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    fetchItinerary()

    return () => {
      isActive = false
    }
  }, [id])

  const groupedItems = useMemo(() => {
    return items.reduce((groups, item) => {
      const date = item.activityDate

      if (!groups[date]) {
        groups[date] = []
      }

      groups[date].push(item)

      return groups
    }, {})
  }, [items])

  const groupedEntries = useMemo(() => {
    return Object.entries(groupedItems).sort(
      ([dateA], [dateB]) => dateA.localeCompare(dateB)
    )
  }, [groupedItems])

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "short",
      }
    )
  }

  const formatTime = (time) => {
    if (!time) return ""

    return new Date(
      `1970-01-01T${time}`
    ).toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    )
  }

  return (
    <TripModulePage
      icon={CalendarDays}
      eyebrow="Planning"
      title="Itinerary"
      description={`Plan ${trip?.title || "your trip"} day by day.`}
      actionLabel="Add activity"
      onAction={() => {}}
    >
      {loading && <ItinerarySkeleton />}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h3 className="font-semibold text-red-800">
            Unable to load itinerary
          </h3>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <TripEmptyState
          icon={CalendarDays}
          title="Your itinerary is empty"
          description="Start planning your trip by adding activities, places to visit, reservations and other important plans."
          actionLabel="Add your first activity"
          onAction={() => {}}
        />
      )}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-6">
          {groupedEntries.map(([date, dayItems]) => (
            <section
              key={date}
              className="rounded-3xl border border-[#e5ebe8] bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-[#e8f6f4] p-2.5">
                  <CalendarDays className="h-5 w-5 text-[#087f82]" />
                </div>

                <div>
                  <h2 className="font-semibold text-[#142c2a]">
                    {formatDate(date)}
                  </h2>

                  <p className="text-xs text-[#71807e]">
                    {dayItems.length}{" "}
                    {dayItems.length === 1
                      ? "activity"
                      : "activities"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {dayItems.map((item) => (
                  <ItineraryItem
                    key={item.id}
                    item={item}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </TripModulePage>
  )
}

function ItineraryItem({ item, formatTime }) {
  return (
    <article className="rounded-2xl border border-[#e8edeb] bg-[#fbfcfb] p-4 transition hover:border-[#c9dcd8] hover:shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex shrink-0 items-center gap-2 text-xs text-[#71807e] sm:w-28">
          <Clock3 className="h-4 w-4 text-[#087f82]" />

          <span>
            {item.startTime
              ? formatTime(item.startTime)
              : "Flexible"}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[#142c2a]">
              {item.title}
            </h3>

            {item.category && (
              <span className="rounded-full border border-[#dce8e5] bg-[#f3f8f7] px-2.5 py-1 text-[11px] text-[#5d706d]">
                {item.category}
              </span>
            )}
          </div>

          {item.notes && (
            <p className="mt-2 text-sm leading-6 text-[#687875]">
              {item.notes}
            </p>
          )}

          {item.location && (
            <div className="mt-3 flex items-center gap-2 text-xs text-[#71807e]">
              <MapPin className="h-3.5 w-3.5" />
              <span>{item.location}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function ItinerarySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-3xl border border-[#e5ebe8] bg-white p-6 shadow-sm"
        >
          <div className="h-5 w-40 rounded bg-[#e8edeb]" />

          <div className="mt-5 space-y-3">
            <div className="h-16 rounded-2xl bg-[#f0f3f2]" />
            <div className="h-16 rounded-2xl bg-[#f0f3f2]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default TripItinerary