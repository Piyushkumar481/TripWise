import api from "./api";

export async function getTravelRecommendations(
  itineraryId,
  preferences
) {
  const response = await api.post(
    `/api/ai/itineraries/${itineraryId}/recommendations`,
    preferences,
    { timeout: 120000 }
  );

  return response.data;
}