import api from "./api"

export const getItinerary = async (tripId) => {
  const response = await api.get(
    `/api/trips/${tripId}/itinerary`
  )

  return response.data
}

export const createItineraryItem = async (
  tripId,
  itineraryData
) => {
  const response = await api.post(
    `/api/trips/${tripId}/itinerary`,
    itineraryData
  )

  return response.data
}

export const updateItineraryItem = async (
  tripId,
  itemId,
  itineraryData
) => {
  const response = await api.put(
    `/api/trips/${tripId}/itinerary/${itemId}`,
    itineraryData
  )

  return response.data
}

export const deleteItineraryItem = async (
  tripId,
  itemId
) => {
  const response = await api.delete(
    `/api/trips/${tripId}/itinerary/${itemId}`
  )

  return response
}