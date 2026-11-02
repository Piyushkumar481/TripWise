import api from "./api"

const aiItineraryService = {
  getHistory(page = 0, size = 9) {
    return api.get("/api/ai/itinerary/history", {
      params: { page, size },
    })
  },

  getById(id) {
    return api.get(`/api/ai/itinerary/history/${id}`)
  },

  regenerate(id) {
    return api.post(`/api/ai/itinerary/history/${id}/regenerate`)
  },

  delete(id) {
    return api.delete(`/api/ai/itinerary/history/${id}`)
  },
}

export default aiItineraryService
