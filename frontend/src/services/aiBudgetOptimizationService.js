import api from "./api";

export async function optimizeTravelBudget(
  itineraryId,
  budgetDetails
) {
  const response = await api.post(
    `/api/ai/itineraries/${itineraryId}/budget-optimization`,
    budgetDetails,
    { timeout: 120000 }
  );

  return response.data;
}