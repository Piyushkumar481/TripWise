import api from "./api";

export async function previewItineraryModification(
  itineraryId,
  modificationRequest
) {
  const response = await api.post(
    `/api/ai/itineraries/${itineraryId}/modify-preview`,
    { modificationRequest },
    { timeout: 120000 }
  );

  return response.data;
}

export async function confirmItineraryModification(
  itineraryId,
  originalItinerary,
  modifiedItinerary
) {
  const response = await api.put(
    `/api/ai/itineraries/${itineraryId}/modify-confirm`,
    {
      originalItinerary,
      modifiedItinerary,
    },
    { timeout: 30000 }
  );

  return response.data;
}