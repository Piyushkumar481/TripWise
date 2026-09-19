import { Compass } from "lucide-react"

function UpcomingTrips() {
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

        </div>

      </div>

    </div>
  )
}

export default UpcomingTrips
