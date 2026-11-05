import api from "./api";

export async function sendTravelChatMessage(itineraryId, message) {
  const response = await api.post(
    "/api/ai/travel-chat",
    {
      itineraryId,
      message,
    },
    {
      timeout: 120000,
    }
  );

  return response.data;
}