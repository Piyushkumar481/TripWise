import { useEffect, useMemo, useState } from "react"
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react"
import { useOutletContext, useParams } from "react-router-dom"

import AddItineraryItemModal from "../components/trip/AddItineraryItemModal"
import ConfirmModal from "../components/ConfirmModal"
import TripEmptyState from "../components/trip/TripEmptyState"
import TripModulePage from "../components/trip/TripModulePage"
import {
  createItineraryItem,
  deleteItineraryItem,
  getItinerary,
  updateItineraryItem,
} from "../services/itineraryService"
import { getApiErrorMessage } from "../utils/errorHandler"

function TripItinerary() {
  const { id } = useParams()
  const { trip } = useOutletContext()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)
  const [deleteError, setDeleteError] = useState("")
  const [deleting, setDeleting] = useState(false)

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
    const sortedItems = [...items].sort((a, b) => {
      const dateComparison = a.activityDate.localeCompare(
        b.activityDate
      )

      if (dateComparison !== 0) {
        return dateComparison
      }

      if (!a.startTime && !b.startTime) {
        return 0
      }

      if (!a.startTime) {
        return 1
      }

      if (!b.startTime) {
        return -1
      }

      return a.startTime.localeCompare(b.startTime)
    })

    return sortedItems.reduce((groups, item) => {
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

  const getTripDayNumber = (date) => {
    if (!trip?.startDate || !date) {
      return null
    }

    const tripStart = new Date(
      `${trip.startDate}T00:00:00`
    )

    const currentDate = new Date(
      `${date}T00:00:00`
    )

    const difference =
      Math.floor(
        (currentDate - tripStart) /
          (1000 * 60 * 60 * 24)
      ) + 1

    return difference
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

  const openAddModal = () => {
    setEditingItem(null)
    setSubmitError("")
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setSubmitError("")
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const closeActivityModal = () => {
    if (submitting) {
      return
    }

    setIsModalOpen(false)
    setEditingItem(null)
    setSubmitError("")
  }

  const handleSubmitActivity = async (activityData) => {
    setSubmitting(true)
    setSubmitError("")

    try {
      if (editingItem) {
        const response = await updateItineraryItem(
          id,
          editingItem.id,
          activityData
        )

        const updatedItem = response?.data

        if (updatedItem) {
          setItems((current) =>
            current.map((item) =>
              item.id === updatedItem.id
                ? updatedItem
                : item
            )
          )
        }
      } else {
        const response = await createItineraryItem(
          id,
          activityData
        )

        const createdItem = response?.data

        if (createdItem) {
          setItems((current) => [
            ...current,
            createdItem,
          ])
        }
      }

      setIsModalOpen(false)
      setEditingItem(null)
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          editingItem
            ? "Unable to update this activity."
            : "Unable to add this activity."
        )
      )
    } finally {
      setSubmitting(false)
    }
  }

  const openDeleteModal = (item) => {
    setDeleteError("")
    setDeletingItem(item)
  }

  const closeDeleteModal = () => {
    if (deleting) {
      return
    }

    setDeletingItem(null)
    setDeleteError("")
  }

  const handleDeleteActivity = async () => {
    if (!deletingItem) {
      return
    }

    setDeleting(true)
    setDeleteError("")

    try {
      await deleteItineraryItem(
        id,
        deletingItem.id
      )

      setItems((current) =>
        current.filter(
          (item) => item.id !== deletingItem.id
        )
      )

      setDeletingItem(null)
    } catch (error) {
      setDeleteError(
        getApiErrorMessage(
          error,
          "Unable to delete this activity."
        )
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <TripModulePage
        icon={CalendarDays}
        eyebrow="Planning"
        title="Itinerary"
        description={`Plan ${trip?.title || "your trip"} day by day.`}
        actionLabel="Add activity"
        onAction={openAddModal}
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
            title="Your itinerary is ready for planning"
            description="Add your first activity, reservation, meal or place to visit. TripWise will organize everything by day and time for you."
            actionLabel="Add your first activity"
            onAction={openAddModal}
          />
        )}

        {!loading && !error && items.length > 0 && (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#e5ebe8] bg-white p-4 shadow-sm">
                <p className="text-xs text-[#71807e]">
                  Activities
                </p>

                <p className="mt-1 text-xl font-bold text-[#142c2a]">
                  {items.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e5ebe8] bg-white p-4 shadow-sm">
                <p className="text-xs text-[#71807e]">
                  Planned days
                </p>

                <p className="mt-1 text-xl font-bold text-[#142c2a]">
                  {Object.keys(groupedItems).length}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e5ebe8] bg-white p-4 shadow-sm">
                <p className="text-xs text-[#71807e]">
                  Trip duration
                </p>

                <p className="mt-1 text-xl font-bold text-[#142c2a]">
                  {trip?.startDate && trip?.endDate
                    ? Math.ceil(
                        (
                          new Date(`${trip.endDate}T00:00:00`) -
                          new Date(`${trip.startDate}T00:00:00`)
                        ) /
                          (1000 * 60 * 60 * 24)
                      ) + 1
                    : "-"}{" "}
                  days
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {groupedEntries.map(([date, dayItems]) => (
                <section
                  key={date}
                  className="rounded-3xl border border-[#e5ebe8] bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f6f4] text-sm font-bold text-[#087f82]">
                        {getTripDayNumber(date)
                          ? `D${getTripDayNumber(date)}`
                          : "-"}
                      </div>

                      <div>
                        <h2 className="font-semibold text-[#142c2a]">
                          {formatDate(date)}
                        </h2>

                        <p className="mt-0.5 text-xs text-[#71807e]">
                          Day {getTripDayNumber(date) || "-"}{" "}
                          &middot;{" "}
                          {dayItems.length}{" "}
                          {dayItems.length === 1
                            ? "activity"
                            : "activities"}
                        </p>
                      </div>
                    </div>

                    <span className="w-fit rounded-full border border-[#dce8e5] bg-[#f3f8f7] px-3 py-1.5 text-xs text-[#71807e]">
                      {dayItems.length} planned
                    </span>
                  </div>

                  <div className="space-y-3">
                    {dayItems.map((item, index) => (
                      <ItineraryItem
                        key={item.id}
                        item={item}
                        formatTime={formatTime}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                        isLast={index === dayItems.length - 1}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </TripModulePage>

      <AddItineraryItemModal
        isOpen={isModalOpen}
        onClose={closeActivityModal}
        onSubmit={handleSubmitActivity}
        trip={trip}
        submitting={submitting}
        error={submitError}
        editingItem={editingItem}
      />

      <ConfirmModal
        isOpen={Boolean(deletingItem)}
        title="Delete activity?"
        message={
          deletingItem
            ? `Are you sure you want to delete "${deletingItem.title}"?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteActivity}
        onCancel={closeDeleteModal}
        loading={deleting}
      />

      {deleteError && (
        <div
          role="alert"
          className="fixed bottom-6 left-1/2 z-[110] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg"
        >
          {deleteError}
        </div>
      )}
    </>
  )
}
function ItineraryItem({
  item,
  formatTime,
  onEdit,
  onDelete,
  isLast,
}) {
  return (
    <div className="relative flex gap-4">
      <div className="flex w-20 shrink-0 flex-col items-center sm:w-24">
        <div className="flex items-center gap-1.5 pt-4 text-xs font-medium text-[#71807e]">
          <Clock3 className="h-3.5 w-3.5 text-[#087f82]" />

          <span>
            {item.startTime
              ? formatTime(item.startTime)
              : "Flexible"}
          </span>
        </div>

        {!isLast && (
          <div className="mt-3 w-px flex-1 bg-[#dfe7e4]" />
        )}
      </div>

      <article className="group mb-3 min-w-0 flex-1 rounded-2xl border border-[#e8edeb] bg-[#fbfcfb] p-4 transition hover:border-[#c9dcd8] hover:bg-white hover:shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
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
                <MapPin className="h-3.5 w-3.5 text-[#087f82]" />
                <span>{item.location}</span>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-60 sm:transition sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="rounded-lg p-2 text-[#71807e] transition hover:bg-[#e8f6f4] hover:text-[#087f82]"
              aria-label={`Edit ${item.title}`}
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(item)}
              className="rounded-lg p-2 text-[#71807e] transition hover:bg-red-50 hover:text-red-500"
              aria-label={`Delete ${item.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {item.endTime && item.startTime && (
          <div className="mt-3 border-t border-[#edf1ef] pt-3 text-xs text-[#71807e]">
            Until {formatTime(item.endTime)}
          </div>
        )}
      </article>
    </div>
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