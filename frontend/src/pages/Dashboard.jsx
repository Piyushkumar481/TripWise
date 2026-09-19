import { useAuth } from "../context/AuthContext"

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">

        <p className="text-sm font-medium text-cyan-400">
          Welcome back, {user?.fullName || "Traveler"}
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Your travel dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-slate-400">
          Keep track of your trips, expenses, itinerary, and travel plans
          from one place.
        </p>

      </div>

    </div>
  )
}

export default Dashboard
