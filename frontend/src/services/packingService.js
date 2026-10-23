import api from "./api"

const unwrapResponse = (response) => {
  return response.data?.data ?? response.data
}

export const getPackingItems = async (tripId) => {
  const response = await api.get(`/api/trips/${tripId}/packing-items`)
  return unwrapResponse(response)
}

export const createPackingItem = async (tripId, itemData) => {
  const response = await api.post(
    `/api/trips/${tripId}/packing-items`,
    itemData
  )
  return unwrapResponse(response)
}

export const updatePackingItem = async (tripId, itemId, itemData) => {
  const response = await api.put(
    `/api/trips/${tripId}/packing-items/${itemId}`,
    itemData
  )
  return unwrapResponse(response)
}

export const updatePackingStatus = async (tripId, itemId, packed) => {
  const response = await api.patch(
    `/api/trips/${tripId}/packing-items/${itemId}/packed`,
    { packed }
  )
  return unwrapResponse(response)
}

export const deletePackingItem = async (tripId, itemId) => {
  return api.delete(`/api/trips/${tripId}/packing-items/${itemId}`)
}

export const getPackingProgress = async (tripId) => {
  const response = await api.get(
    `/api/trips/${tripId}/packing-items/progress`
  )
  return unwrapResponse(response)
}