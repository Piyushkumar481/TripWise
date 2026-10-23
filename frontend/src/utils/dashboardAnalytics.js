import { getTripStatus } from "./tripUtils"

const parseDate = (value) => {
  if (!value) return null

  const date = new Date(`${value}T00:00:00`)

  return Number.isNaN(date.getTime()) ? null : date
}

export const calculateDashboardAnalytics = (trips = []) => {
  const validTrips = Array.isArray(trips) ? trips : []

  const upcomingTrips = []
  const activeTrips = []
  const completedTrips = []

  let totalBudget = 0

  const destinationCounts = new Map()

  validTrips.forEach((trip) => {
    const budget = Number(trip?.budget)

    if (Number.isFinite(budget) && budget > 0) {
      totalBudget += budget
    }

    const status = getTripStatus(trip)

    if (status === "UPCOMING") {
      upcomingTrips.push(trip)
    } else if (status === "ACTIVE") {
      activeTrips.push(trip)
    } else if (status === "COMPLETED") {
      completedTrips.push(trip)
    }

    const destination = [
      trip?.destinationCity,
      trip?.destinationCountry,
    ]
      .filter((value) => typeof value === "string" && value.trim())
      .map((value) => value.trim())
      .join(", ")

    if (destination) {
      const key = destination.toLocaleLowerCase("en-IN")
      const existing = destinationCounts.get(key)

      if (existing) {
        existing.count += 1
      } else {
        destinationCounts.set(key, {
          name: destination,
          count: 1,
        })
      }
    }
  })

  upcomingTrips.sort((a, b) => {
    const firstDate = parseDate(a.startDate)
    const secondDate = parseDate(b.startDate)

    if (!firstDate) return 1
    if (!secondDate) return -1

    return firstDate.getTime() - secondDate.getTime()
  })

  const mostPlannedDestination =
    [...destinationCounts.values()].sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name)
    )[0] ?? null

  const totalTrips = validTrips.length

  const percentage = (count) => {
    if (totalTrips === 0) return 0

    return Math.round((count / totalTrips) * 100)
  }

  return {
    totalTrips,
    upcomingTrips,
    activeTrips,
    completedTrips,
    totalBudget,
    nextTrip: upcomingTrips[0] ?? null,
    mostPlannedDestination,
    distribution: {
      upcoming: {
        count: upcomingTrips.length,
        percentage: percentage(upcomingTrips.length),
      },
      active: {
        count: activeTrips.length,
        percentage: percentage(activeTrips.length),
      },
      completed: {
        count: completedTrips.length,
        percentage: percentage(completedTrips.length),
      },
    },
  }
}

export const getDaysUntilTrip = (startDate) => {
  const start = parseDate(startDate)

  if (!start) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Math.max(
    0,
    Math.ceil(
      (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )
  )
}

export const formatAnalyticsCurrency = (amount) => {
  const value = Number(amount)

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)
}

export const formatAnalyticsDate = (value) => {
  const date = parseDate(value)

  if (!date) return "Date unavailable"

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}