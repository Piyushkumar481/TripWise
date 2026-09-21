import api from "./api"

export const getTrips = async ({
  page = 0,
  size = 10,
  sortBy = "startDate",
  sortDirection = "asc",
  search = "",
  destination = "",
  startDateFrom = "",
  startDateTo = "",
} = {}) => {
  const params = {
    page,
    size,
    sortBy,
    sortDirection,
  }

  if (search.trim()) {
    params.search = search.trim()
  }

  if (destination.trim()) {
    params.destination = destination.trim()
  }

  if (startDateFrom) {
    params.startDateFrom = startDateFrom
  }

  if (startDateTo) {
    params.startDateTo = startDateTo
  }

  const response = await api.get("/api/trips", {
    params,
  })

  return response.data
}

export const getTripById = async (id) => {
  const response = await api.get(`/api/trips/${id}`)
  return response.data
}

export const createTrip = async (tripData) => {
  const response = await api.post("/api/trips", tripData)
  return response.data
}

export const updateTrip = async (id, tripData) => {
  const response = await api.put(`/api/trips/${id}`, tripData)
  return response.data
}

export const deleteTrip = async (id) => {
  const response = await api.delete(`/api/trips/${id}`)
  return response
}

export const archiveTrip = async (id) => {
  const response = await api.patch(`/api/trips/${id}/archive`)
  return response.data
}
