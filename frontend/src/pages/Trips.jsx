import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  ArrowRight,
  CalendarDays,
  CheckSquare,
  FileText,
  Map,
  MapPin,
  Plus,
  Search,
  Wallet,
} from "lucide-react"

import { useNavigate } from "react-router-dom"

import { getTrips } from "../services/tripService"
import { getApiErrorMessage } from "../utils/errorHandler"

function Trips() {
  const navigate = useNavigate()

  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const requestId = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 350)

    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const loadTrips = async () => {
      const currentRequestId = ++requestId.current

      try {
        if (currentRequestId === requestId.current) {
          setLoading(true)
          setError("")
        }

        const response = await getTrips({
          page,
          size: 9,
          sortBy: "startDate",
          sortDirection: "asc",
          search: debouncedSearch,
        })

        if (currentRequestId !== requestId.current) {
          return
        }

        const pageData = response?.data

        setTrips(pageData?.content || [])
        setTotalPages(pageData?.totalPages || 0)
        setTotalElements(pageData?.totalElements || 0)
      } catch (error) {
        console.error("Failed to load trips:", error)

        if (currentRequestId === requestId.current) {
          setError(
            getApiErrorMessage(
              error,
              "Unable to load your trips."
            )
          )

          setTrips([])
        }
      } finally {
        if (currentRequestId === requestId.current) {
          setLoading(false)
        }
      }
    }

    loadTrips()
  }, [page, debouncedSearch])

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setPage(0)
  }

  const formatDate = (date) => {
    if (!date) return "No date"

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    )
  }

  const formatBudget = (budget) => {
    if (
      budget === null ||
      budget === undefined
    ) {
      return "Not set"
    }

    return `?${Number(budget).toLocaleString("en-IN")}`
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "PLANNED":
        return "border-[#b9dfda] bg-[#eaf8f6] text-[#087f82]"

      case "ONGOING":
        return "border-[#b9dfc8] bg-[#edf9f1] text-[#198154]"

      case "COMPLETED":
        return "border-[#cbd4f1] bg-[#eef1ff] text-[#5369b7]"

      case "CANCELLED":
        return "border-[#f1cbc5] bg-[#fff1ef] text-[#c96556]"

      default:
        return "border-[#dce3df] bg-[#f4f6f4] text-[#687583]"
    }
  }

  return (
    <div className="mx-auto max-w-[1450px] space-y-7">

      {/* Clean Hero */}
      <section className="relative overflow-hidden rounded-[28px] border border-[#dce8e4] bg-[#edf8f6] px-7 py-10 shadow-[0_10px_30px_rgba(23,35,60,0.045)] sm:px-10 lg:px-12">

        {/* subtle decorative shapes */}
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#d3eee9]" />

        <div className="absolute -bottom-28 right-32 h-52 w-52 rounded-full bg-[#f6e9d8]/70" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">

          <div className="max-w-[720px]">

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#159b9b]">
              Your journeys
            </p>

            <h1 className="mt-3 font-serif text-[42px] font-bold leading-[1.05] tracking-[-0.04em] text-[#17233c] sm:text-[50px]">
              My Trips
            </h1>

            <p className="mt-4 max-w-[620px] text-[15px] leading-6 text-[#627481]">
              Plan your next adventure, organize every detail,
              and keep all your journeys in one place.
            </p>

          </div>

          <button
            type="button"
            onClick={() => navigate("/trips/new")}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#159b9b] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(21,155,155,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#087f82]"
          >
            <Plus size={18} />
            Create New Trip
          </button>

        </div>

      </section>

      {/* Section Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <h2 className="font-serif text-[28px] font-bold tracking-tight text-[#17233c]">
            Your Journeys
          </h2>

          <p className="mt-1.5 text-sm text-[#7b8794]">
            {totalElements > 0
              ? `${totalElements} ${
                  totalElements === 1
                    ? "trip"
                    : "trips"
                } in your collection`
              : "Your planned adventures will appear here."}
          </p>

        </div>

        <div className="relative w-full sm:w-[330px]">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d99a3]"
          />

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search trips or destinations..."
            className="h-11 w-full rounded-full border border-[#dfe5e1] bg-white pl-11 pr-5 text-sm text-[#17233c] shadow-[0_5px_18px_rgba(23,35,60,0.03)] outline-none transition placeholder:text-[#a1aab2] focus:border-[#159b9b] focus:ring-4 focus:ring-[#159b9b]/10"
          />

        </div>

      </section>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-[#f1c9c3] bg-[#fff0ed] px-5 py-4 text-sm text-[#c65f50]">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-[#e1e7e3] bg-white p-5 shadow-[0_7px_25px_rgba(23,35,60,0.035)]"
            >
              <div className="h-36 animate-pulse rounded-2xl bg-[#edf2ef]" />

              <div className="mt-5 h-5 w-2/3 animate-pulse rounded bg-[#edf2ef]" />

              <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-[#edf2ef]" />

              <div className="mt-6 h-14 animate-pulse rounded-xl bg-[#f4f6f4]" />
            </div>
          ))}

        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        trips.length === 0 && (
          <>

            <section className="relative overflow-hidden rounded-[28px] border border-[#e1e7e3] bg-white px-6 py-16 shadow-[0_8px_28px_rgba(23,35,60,0.035)] sm:px-10">

              <div className="relative z-10 mx-auto max-w-[650px] text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8f7f5] text-[#159b9b]">
                  <MapPin
                    size={30}
                    strokeWidth={1.8}
                  />
                </div>

                <h2 className="mt-6 font-serif text-[30px] font-bold tracking-tight text-[#17233c] sm:text-[34px]">
                  {search
                    ? "No matching trips"
                    : "Your next adventure starts here."}
                </h2>

                <p className="mx-auto mt-3 max-w-[520px] text-sm leading-6 text-[#7b8794]">
                  {search
                    ? "Try another trip name or destination."
                    : "You haven't planned a trip yet. Create your first journey and keep everything organized in one place."}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/trips/new")
                    }
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#ef7767] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(239,119,103,0.2)] transition hover:-translate-y-0.5 hover:bg-[#e76656]"
                  >
                    <Plus size={18} />
                    Plan Your First Trip
                  </button>
                )}

              </div>

              {/* subtle background decoration */}
              <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#edf8f6]" />

              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#f7efe3]" />

              <div className="absolute bottom-8 left-10 hidden items-end gap-2 opacity-30 lg:flex">
                <div className="h-12 w-3 rounded-full bg-[#159b9b]" />
                <div className="h-20 w-3 rounded-full bg-[#159b9b]" />
                <div className="h-9 w-3 rounded-full bg-[#159b9b]" />
              </div>

            </section>

            {/* Feature Cards */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

              <FeatureCard
                icon={Map}
                iconClass="bg-[#e7f7f4] text-[#159b9b]"
                title="Plan"
                description="Organize your trips and itineraries with ease."
              />

              <FeatureCard
                icon={Wallet}
                iconClass="bg-[#fff0ec] text-[#ed735e]"
                title="Track"
                description="Manage your travel expenses in one place."
              />

              <FeatureCard
                icon={FileText}
                iconClass="bg-[#eeefff] text-[#6572c8]"
                title="Store"
                description="Keep your travel documents safe and accessible."
              />

              <FeatureCard
                icon={CheckSquare}
                iconClass="bg-[#e8f2ff] text-[#3786d9]"
                title="Prepare"
                description="Never forget the essentials with smart packing lists."
              />

            </section>

          </>
        )}

      {/* Real Trips */}
      {!loading &&
        trips.length > 0 && (
          <>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

              {trips.map((trip) => (
                <article
                  key={trip.id}
                  className="overflow-hidden rounded-3xl border border-[#e1e7e3] bg-white shadow-[0_7px_25px_rgba(23,35,60,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#c5ded9] hover:shadow-[0_15px_32px_rgba(23,35,60,0.08)]"
                >

                  <div className="relative h-40 overflow-hidden bg-[#eaf7f5]">

                    <div className="absolute inset-0 bg-gradient-to-br from-[#d8f0ec] via-[#edf8f6] to-[#f5eadb]" />

                    <span
                      className={`absolute left-5 top-5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] ${getStatusStyle(
                        trip.status
                      )}`}
                    >
                      {trip.status ||
                        "PLANNED"}
                    </span>

                    <div className="absolute bottom-5 left-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-[#159b9b] backdrop-blur-sm">
                      <MapPin size={20} />
                    </div>

                  </div>

                  <div className="p-5">

                    <h3 className="text-lg font-bold text-[#17233c]">
                      {trip.title}
                    </h3>

                    <p className="mt-2 flex items-center gap-2 text-sm text-[#71808d]">
                      <MapPin
                        size={15}
                        className="text-[#159b9b]"
                      />

                      {trip.destinationCity ||
                        "Unknown city"}

                      {trip.destinationCountry
                        ? `, ${trip.destinationCountry}`
                        : ""}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-[#f6f8f6] p-3">

                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-[#98a2aa]">
                          <CalendarDays size={14} />
                          Dates
                        </div>

                        <p className="mt-2 text-xs font-bold text-[#526271]">
                          {formatDate(
                            trip.startDate
                          )}
                        </p>

                        <p className="text-[11px] text-[#929da5]">
                          to{" "}
                          {formatDate(
                            trip.endDate
                          )}
                        </p>

                      </div>

                      <div className="rounded-xl bg-[#f6f8f6] p-3">

                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-[#98a2aa]">
                          <Wallet size={14} />
                          Budget
                        </div>

                        <p className="mt-2 text-sm font-bold text-[#526271]">
                          {formatBudget(
                            trip.budget
                          )}
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/trips/${trip.id}`)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dfe5e1] py-2.5 text-sm font-bold text-[#637182] transition hover:border-[#b9dcd7] hover:bg-[#eaf7f5] hover:text-[#087f82]"
                    >
                      View Trip
                      <ArrowRight size={15} />
                    </button>

                  </div>

                </article>
              ))}

            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between rounded-2xl border border-[#e1e7e3] bg-white p-4">

                <p className="text-sm text-[#7b8794]">
                  Page {page + 1} of {totalPages}
                </p>

                <div className="flex gap-2">

                  <button
                    type="button"
                    disabled={page === 0}
                    onClick={() =>
                      setPage(
                        (current) =>
                          current - 1
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe5e1] text-[#687583] disabled:opacity-30"
                  >
                    ?
                  </button>

                  <button
                    type="button"
                    disabled={
                      page >=
                      totalPages - 1
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          current + 1
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe5e1] text-[#687583] disabled:opacity-30"
                  >
                    ?
                  </button>

                </div>

              </div>
            )}

          </>
        )}

    </div>
  )
}

function FeatureCard({
  icon: Icon,
  iconClass,
  title,
  description,
}) {
  return (
    <div className="group flex min-h-[125px] items-center rounded-2xl border border-[#e3e7e3] bg-white px-5 py-5 shadow-[0_6px_20px_rgba(23,35,60,0.03)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(23,35,60,0.06)]">

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon
          size={23}
          strokeWidth={1.8}
        />
      </div>

      <div className="ml-4 min-w-0">

        <h3 className="text-[16px] font-black text-[#17233c]">
          {title}
        </h3>

        <p className="mt-1.5 text-[13px] leading-5 text-[#71808d]">
          {description}
        </p>

      </div>

      <ArrowRight
        size={17}
        className="ml-auto shrink-0 text-[#9aa5ad] transition group-hover:translate-x-1 group-hover:text-[#159b9b]"
      />

    </div>
  )
}

export default Trips

