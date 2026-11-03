import { Link } from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  MapPin,
  RefreshCw,
  Sparkles,
  Trash2,
  Users,
  Wallet,
  X,
} from "lucide-react"

import ConfirmModal from "../components/ConfirmModal"
import PageTitle from "../components/PageTitle"
import aiItineraryService from "../services/aiItineraryService"

const PAGE_SIZE = 9

const formatDate = (date) => {
  if (!date) return "Date unavailable"

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const formatCurrency = (amount, currency = "INR") => {
  if (amount == null) return "Not available"

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

function HistorySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[24px] border border-[#e1e7e3] bg-white p-6"
        >
          <div className="h-5 w-1/2 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-3/4 rounded bg-slate-100" />
          <div className="mt-7 h-24 rounded-xl bg-slate-100" />
          <div className="mt-5 h-10 rounded-xl bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

function ItineraryDetailsModal({ item, onClose }) {
  if (!item) return null

  const request = item.request || {}
  const itinerary = item.itinerary || {}

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#17233c]/50 px-3 py-5 backdrop-blur-sm sm:px-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-[#f7f5ef] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#e1e7e3] bg-white px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#159b9b]">
              Saved AI itinerary
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-[#17233c] sm:text-3xl">
              {itinerary.title || itinerary.destination || request.destination}
            </h2>
            <p className="mt-1 text-sm text-[#71808d]">
              Saved {formatDate(item.createdAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[#71808d] transition hover:bg-[#f2f5f3]"
            aria-label="Close itinerary details"
          >
            <X size={21} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-7">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4">
              <MapPin className="mb-2 text-[#159b9b]" size={20} />
              <p className="text-xs text-[#71808d]">Destination</p>
              <p className="mt-1 font-bold text-[#17233c]">
                {itinerary.destination || request.destination || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <CalendarDays className="mb-2 text-[#159b9b]" size={20} />
              <p className="text-xs text-[#71808d]">Duration</p>
              <p className="mt-1 font-bold text-[#17233c]">
                {itinerary.duration || request.duration || "—"} days
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <Wallet className="mb-2 text-[#159b9b]" size={20} />
              <p className="text-xs text-[#71808d]">Estimated cost</p>
              <p className="mt-1 font-bold text-[#17233c]">
                {formatCurrency(itinerary.totalEstimatedCost, itinerary.currency)}
              </p>
            </div>
          </div>

          {itinerary.summary && (
            <section className="mt-6 rounded-2xl bg-white p-5">
              <h3 className="font-serif text-xl font-bold text-[#17233c]">
                Overview
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#71808d]">
                {itinerary.summary}
              </p>
            </section>
          )}

          <section className="mt-6">
            <h3 className="mb-4 font-serif text-xl font-bold text-[#17233c]">
              Your itinerary
            </h3>

            {itinerary.itinerary?.length ? (
              <div className="space-y-4">
                {itinerary.itinerary.map((day, index) => (
                  <div
                    key={`${day.day ?? index}-${day.title}`}
                    className="rounded-2xl border border-[#e1e7e3] bg-white p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f7f5] font-bold text-[#087f82]">
                        {day.day ?? index + 1}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-bold text-[#17233c]">
                          {day.title || `Day ${index + 1}`}
                        </h4>
                        {day.description && (
                          <p className="mt-1 text-sm leading-6 text-[#71808d]">
                            {day.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {day.activities?.length > 0 && (
                      <div className="mt-5 space-y-3">
                        {day.activities.map((activity, activityIndex) => (
                          <div
                            key={`${activity.name}-${activityIndex}`}
                            className="rounded-xl bg-[#f7f9f7] p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h5 className="font-semibold text-[#17233c]">
                                {activity.name}
                              </h5>

                              {activity.time && (
                                <span className="flex items-center gap-1 text-xs text-[#71808d]">
                                  <Clock size={13} />
                                  {activity.time}
                                </span>
                              )}
                            </div>

                            {activity.location && (
                              <p className="mt-1 text-xs text-[#159b9b]">
                                {activity.location}
                              </p>
                            )}

                            {activity.description && (
                              <p className="mt-2 text-sm leading-6 text-[#71808d]">
                                {activity.description}
                              </p>
                            )}

                            {activity.transportSuggestion && (
                              <p className="mt-2 text-xs text-[#71808d]">
                                Transport: {activity.transportSuggestion}
                              </p>
                            )}

                            {activity.estimatedCost != null && (
                              <p className="mt-2 text-xs font-semibold text-[#087f82]">
                                Estimated cost:{" "}
                                {formatCurrency(activity.estimatedCost, itinerary.currency)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl bg-white p-5 text-sm text-[#71808d]">
                No day-by-day itinerary details are available.
              </p>
            )}
          </section>

          {itinerary.costBreakdown && (
            <section className="mt-6 rounded-2xl bg-white p-5">
              <h3 className="font-serif text-xl font-bold text-[#17233c]">
                Cost breakdown
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(itinerary.costBreakdown).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between gap-3 border-b border-[#edf0ed] py-2 text-sm"
                  >
                    <span className="capitalize text-[#71808d]">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-semibold text-[#17233c]">
                      {formatCurrency(value, itinerary.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {itinerary.travelTips?.length > 0 && (
            <section className="mt-6 rounded-2xl bg-white p-5">
              <h3 className="font-serif text-xl font-bold text-[#17233c]">
                Travel tips
              </h3>
              <ul className="mt-3 space-y-2">
                {itinerary.travelTips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex gap-2 text-sm leading-6 text-[#71808d]"
                  >
                    <span className="text-[#159b9b]">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function AIItineraryHistory() {
  const [history, setHistory] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [regeneratingId, setRegeneratingId] = useState(null)

  const loadHistory = useCallback(async (pageNumber = 0) => {
    setLoading(true)
    setError("")

    try {
      const response = await aiItineraryService.getHistory(pageNumber, PAGE_SIZE)
      const data = response.data

      setHistory(Array.isArray(data.content) ? data.content : [])
      setPage(data.number ?? pageNumber)
      setTotalPages(data.totalPages ?? 0)
      setTotalElements(data.totalElements ?? 0)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to load your saved AI itineraries."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHistory(0)
  }, [loadHistory])

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleteLoading(true)

    try {
      await aiItineraryService.delete(deleteTarget.id)
      setDeleteTarget(null)

      const nextPage = history.length === 1 && page > 0 ? page - 1 : page
      await loadHistory(nextPage)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete this itinerary. Please try again."
      )
      setDeleteTarget(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleRegenerate = async (item) => {
    const confirmed = window.confirm(
      "Regenerate this itinerary? The existing generated itinerary will be replaced."
    )

    if (!confirmed) return

    setRegeneratingId(item.id)
    setError("")

    try {
      const response = await aiItineraryService.regenerate(item.id)
      setHistory((current) =>
        current.map((entry) => entry.id === item.id ? response.data : entry)
      )

      if (selectedItem?.id === item.id) {
        setSelectedItem(response.data)
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Regeneration failed. Please try again."
      )
    } finally {
      setRegeneratingId(null)
    }
  }

  return (
    <>
      <div className="space-y-7">
        <div className="relative overflow-hidden rounded-[28px] border border-[#dceee8] bg-[#edf8f6] px-6 py-8 sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-[#159b9b]/10" />
          <div className="pointer-events-none absolute -bottom-20 right-28 h-40 w-40 rounded-full bg-[#159b9b]/10" />

          <div className="relative">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#159b9b]">
              <Sparkles size={15} />
              Your AI travel collection
            </div>

            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#17233c] sm:text-4xl">
              AI Itinerary History
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#71808d] sm:text-base">
              Revisit your saved travel plans, explore the details, or regenerate
              an itinerary when your plans change.
            </p>

            {!loading && (
              <div className="mt-5 inline-flex rounded-full border border-[#d4e9e3] bg-white/80 px-4 py-2 text-sm font-semibold text-[#087f82]">
                {totalElements} saved {totalElements === 1 ? "itinerary" : "itineraries"}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <PageTitle
              title="Your saved plans"
              subtitle="All your previously generated AI travel itineraries."
            />
          </div>

          <button
            type="button"
            onClick={() => loadHistory(page)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#dfe5e1] bg-white px-4 py-2.5 text-sm font-semibold text-[#637182] transition hover:border-[#159b9b] hover:text-[#087f82] disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => loadHistory(page)}
              className="font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <HistorySkeleton />
        ) : history.length === 0 ? (
          <div className="rounded-[24px] border border-[#e1e7e3] bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8f7f5] text-[#159b9b]">
              <Sparkles size={28} />
            </div>

            <h2 className="mt-5 font-serif text-2xl font-bold text-[#17233c]">
              No saved AI itineraries yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#71808d]">
              Once you generate an AI itinerary, it will appear here so you can
              revisit and manage your travel plans.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {history.map((item) => {
                const request = item.request || {}
                const itinerary = item.itinerary || {}
                const destination =
                  itinerary.destination || request.destination || "Unknown destination"

                return (
                  <article
                    key={item.id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-[#e1e7e3] bg-white shadow-[0_4px_18px_rgba(23,35,60,0.03)] transition duration-300 hover:-translate-y-1 hover:border-[#b9dfd8] hover:shadow-[0_14px_35px_rgba(23,35,60,0.08)]"
                  >
                    <div className="relative bg-[#edf8f6] px-5 py-5">
                      <div className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#087f82]">
                        AI generated
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#159b9b] shadow-sm">
                        <MapPin size={21} />
                      </div>

                      <h2 className="mt-4 pr-20 font-serif text-xl font-bold text-[#17233c]">
                        {itinerary.title || destination}
                      </h2>

                      <p className="mt-1 flex items-center gap-1.5 text-sm text-[#71808d]">
                        <MapPin size={14} />
                        {destination}
                      </p>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      {itinerary.summary && (
                        <p className="line-clamp-3 text-sm leading-6 text-[#71808d]">
                          {itinerary.summary}
                        </p>
                      )}

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-[#f7f9f7] p-3">
                          <CalendarDays size={16} className="text-[#159b9b]" />
                          <p className="mt-2 text-xs text-[#71808d]">Duration</p>
                          <p className="mt-1 text-sm font-bold text-[#17233c]">
                            {itinerary.duration || request.duration || "—"} days
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#f7f9f7] p-3">
                          <Wallet size={16} className="text-[#159b9b]" />
                          <p className="mt-2 text-xs text-[#71808d]">Estimated budget</p>
                          <p className="mt-1 text-sm font-bold text-[#17233c]">
                            {formatCurrency(
                              itinerary.totalEstimatedCost ?? request.budget,
                              itinerary.currency
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#71808d]">
                        <Users size={14} />
                        {request.travelers || "—"} travelers
                        <span className="mx-1">·</span>
                        Saved {formatDate(item.createdAt)}
                      </div>

                      <div className="mt-auto flex flex-wrap gap-2 pt-5">
                        <Link
                          to={`/ai-itinerary/${item.id}`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#159b9b] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#087f82]"
                        >
                          <Eye size={16} />
                          View Details
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleRegenerate(item)}
                          disabled={regeneratingId === item.id}
                          title="Regenerate itinerary"
                          className="inline-flex items-center justify-center rounded-xl border border-[#dfe5e1] px-3 py-2.5 text-[#637182] transition hover:border-[#159b9b] hover:text-[#087f82] disabled:opacity-50"
                        >
                          <RefreshCw
                            size={16}
                            className={regeneratingId === item.id ? "animate-spin" : ""}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          title="Delete itinerary"
                          className="inline-flex items-center justify-center rounded-xl border border-[#f0d9d5] px-3 py-2.5 text-[#d66b5a] transition hover:bg-[#fff1ee]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {regeneratingId === item.id && (
                        <p className="mt-3 text-xs text-[#087f82]">
                          Regenerating with AI. This may take several minutes...
                        </p>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e1e7e3] bg-white px-5 py-4">
                <p className="text-sm text-[#71808d]">
                  Page {page + 1} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadHistory(page - 1)}
                    disabled={page === 0 || loading}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#dfe5e1] px-3 py-2 text-sm font-semibold text-[#637182] transition hover:border-[#159b9b] hover:text-[#087f82] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => loadHistory(page + 1)}
                    disabled={page >= totalPages - 1 || loading}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#dfe5e1] px-3 py-2 text-sm font-semibold text-[#637182] transition hover:border-[#159b9b] hover:text-[#087f82] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ItineraryDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete AI itinerary"
        message={`Delete the saved itinerary for "${deleteTarget?.itinerary?.destination || deleteTarget?.request?.destination || "this destination"}"? This action cannot be undone.`}
        confirmText="Delete itinerary"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </>
  )
}

export default AIItineraryHistory


