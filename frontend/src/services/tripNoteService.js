import api from "./api"

const unwrapResponse = (response) => {
  return response.data?.data ?? response.data
}

export const getTripNotes = async (tripId) => {
  const response = await api.get(`/api/trips/${tripId}/notes`)
  return unwrapResponse(response)
}

export const getTripNote = async (tripId, noteId) => {
  const response = await api.get(
    `/api/trips/${tripId}/notes/${noteId}`
  )

  return unwrapResponse(response)
}

export const createTripNote = async (tripId, noteData) => {
  const response = await api.post(
    `/api/trips/${tripId}/notes`,
    noteData
  )

  return unwrapResponse(response)
}

export const updateTripNote = async (tripId, noteId, noteData) => {
  const response = await api.put(
    `/api/trips/${tripId}/notes/${noteId}`,
    noteData
  )

  return unwrapResponse(response)
}

export const updateTripNotePinnedStatus = async (
  tripId,
  noteId,
  pinned
) => {
  const response = await api.patch(
    `/api/trips/${tripId}/notes/${noteId}/pinned`,
    { pinned }
  )

  return unwrapResponse(response)
}

export const deleteTripNote = async (tripId, noteId) => {
  return api.delete(`/api/trips/${tripId}/notes/${noteId}`)
}

export const getTripNotesSummary = async (tripId) => {
  const response = await api.get(
    `/api/trips/${tripId}/notes/summary`
  )

  return unwrapResponse(response)
}