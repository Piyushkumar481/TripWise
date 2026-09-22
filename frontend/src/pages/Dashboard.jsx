import { useEffect, useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

import DashboardHero from "../components/DashboardHero"
import DashboardSection from "../components/DashboardSection"
import StatCard from "../components/StatCard"
import UpcomingTrips from "../components/UpcomingTrips"
import TravelInspiration from "../components/TravelInspiration"

import { getTrips } from "../services/tripService"
import { getApiErrorMessage } from "../utils/errorHandler"
import { getTripStatus } from "../utils/tripUtils"

function Dashboard() {
  const navigate = useNavigate()

  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await getTrips({
          page: 0,
          size: 100,
          sortBy: "startDate",
          sortDirection: "asc",
        })

        setTrips(response?.data?.content || [])
      } catch (error) {
        console.error("Failed to load dashboard trips:", error)

        setError(
          getApiErrorMessage(
            error,
            "Unable to load your trips."
          )
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [])

  const dashboardStats = useMemo(() => {
    const tripsWithStatus = trips.map((trip) => ({
      trip,
      status: getTripStatus(trip),
    }))

    const upcomingTrips = tripsWithStatus
      .filter(({ status }) => status === "UPCOMING")
      .map(({ trip }) => trip)

    const activeTrips = tripsWithStatus.filter(
      ({ status }) => status === "ACTIVE"
    )

    const completedTrips = tripsWithStatus.filter(
      ({ status }) => status === "COMPLETED"
    )

    const totalBudget = trips.reduce((total, trip) => {
      return total + Number(trip.budget || 0)
    }, 0)

    return {
      totalTrips: trips.length,
      upcomingTrips: upcomingTrips.length,
      activeTrips: activeTrips.length,
      completedTrips: completedTrips.length,
      totalBudget,
      upcomingTripList: upcomingTrips.slice(0, 3),
    }
  }, [trips])

  const formatBudget = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">

      <DashboardHero />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

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
            value={loading ? "Ã¢â‚¬â€" : dashboardStats.totalTrips}
            description="Journeys planned"
          />

          <StatCard
            type="countries"
            label="Upcoming Trips"
            value={loading ? "Ã¢â‚¬â€" : dashboardStats.upcomingTrips}
            description="Future journeys"
          />

          <StatCard
            type="budget"
            label="Total Budget"
            value={
              loading
                ? "Ã¢â‚¬â€"
                : formatBudget(dashboardStats.totalBudget)
            }
            description="Across your trips"
          />

          <StatCard
            type="expenses"
            label="Active Trips"
            value={loading ? "Ã¢â‚¬â€" : dashboardStats.activeTrips}
            description="Trips happening now"
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
          <UpcomingTrips
            trips={dashboardStats.upcomingTripList}
            loading={loading}
          />
        </DashboardSection>

        <TravelInspiration />

      </div>

    </div>
  )
}

export default Dashboard
