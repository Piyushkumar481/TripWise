import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

import DashboardHero from "../components/DashboardHero"
import DashboardSection from "../components/DashboardSection"
import StatCard from "../components/StatCard"
import UpcomingTrips from "../components/UpcomingTrips"
import TravelInspiration from "../components/TravelInspiration"

function Dashboard() {
  const navigate = useNavigate()

  const emptyValue = String.fromCharCode(8212)

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">

      <DashboardHero />

      <section>

        <div className="mb-5">

          <h2 className="font-serif text-[27px] font-bold tracking-tight text-[#17233c]">
            Travel Overview
          </h2>

          <p className="mt-1.5 text-sm text-[#7b8794]">
            A clear view of your travel activity.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            type="trips"
            label="Total Trips"
            value={emptyValue}
            description="Journeys planned"
          />

          <StatCard
            type="countries"
            label="Countries Visited"
            value={emptyValue}
            description="Destinations explored"
          />

          <StatCard
            type="budget"
            label="Total Budget"
            value={emptyValue}
            description="Across your trips"
          />

          <StatCard
            type="expenses"
            label="Total Expenses"
            value={emptyValue}
            description="Tracked spending"
          />

        </div>

      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_0.85fr]">

        <DashboardSection
          title="Upcoming Trips"
          subtitle="Your next journeys at a glance."
          action={
            <button
              type="button"
              onClick={() => navigate("/trips")}
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#159b9b] transition hover:text-[#087f82]"
            >
              View All Trips

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          }
        >
          <UpcomingTrips />
        </DashboardSection>

        <TravelInspiration />

      </div>

    </div>
  )
}

export default Dashboard
