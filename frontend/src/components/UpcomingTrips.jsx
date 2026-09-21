import { ArrowRight, CalendarDays, Compass, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"

function UpcomingTrips({ trips = [], loading = false }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-[88px] animate-pulse rounded-2xl border border-[#e1e7e3] bg-[#f3f6f4]"
          />
        ))}
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <div className="flex min-h-[220px] items-center rounded-3xl border border-[#e1e7e3] bg-white px-7 py-9 shadow-[0_7px_25px_rgba(23,35,60,0.035)] sm:px-10">

        <div className="flex w-full flex-col items-center text-center sm:flex-row sm:text-left">

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e8f7f5] text-[#159b9b]">
            <Compass size={29} strokeWidth={1.7} />
          </div>

          <div className="mt-5 sm:ml-6 sm:mt-0">

            <h3 className="font-serif text-[22px] font-bold text-[#17233c]">
              No upcoming trips
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#7b8794]">
              Your planned trips will appear here.
              Start planning your next adventure from{" "}
              <span className="font-semibold text-[#159b9b]">
                My Trips
              </span>
              .
            </p>

            <button
              type="button"
              onClick={() => navigate("/trips/new")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#159b9b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#087f82]"
            >
              Create Trip
              <ArrowRight size={15} />
            </button>

          </div>

        </div>

      </div>
    )
  }

  const formatDate = (date) => {
    if (!date) {
      return "Date not set"
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    )
  }

  return (
    <div className="space-y-3">

      {trips.map((trip) => {

        const destination =
          [trip.destinationCity, trip.destinationCountry]
            .filter(Boolean)
            .join(", ") || "Destination not set"

        return (
          <button
            key={trip.id}
            type="button"
            onClick={() => navigate(`/trips/${trip.id}`)}
            className="group flex w-full items-center justify-between rounded-2xl border border-[#e1e7e3] bg-white p-4 text-left shadow-[0_5px_20px_rgba(23,35,60,0.025)] transition duration-300 hover:-translate-y-0.5 hover:border-[#c5ded9] hover:shadow-[0_10px_25px_rgba(23,35,60,0.06)]"
          >

            <div className="flex min-w-0 items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f7f5] text-[#159b9b]">
                <CalendarDays size={19} />
              </div>

              <div className="min-w-0">

                <h3 className="truncate text-sm font-bold text-[#17233c]">
                  {trip.title}
                </h3>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#7b8794]">

                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} />
                    {destination}
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={13} />
                    {formatDate(trip.startDate)}
                  </span>

                </div>

              </div>

            </div>

            <ArrowRight
              size={17}
              className="ml-4 shrink-0 text-[#9aa5ae] transition-all group-hover:translate-x-1 group-hover:text-[#159b9b]"
            />

          </button>
        )
      })}

    </div>
  )
}

export default UpcomingTrips
