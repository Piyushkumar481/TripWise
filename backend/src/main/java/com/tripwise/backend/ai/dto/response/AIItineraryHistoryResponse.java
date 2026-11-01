package com.tripwise.backend.ai.dto.response;

import com.tripwise.backend.ai.dto.request.AITripRequest;
import java.time.Instant;

public record AIItineraryHistoryResponse(
        Long id,
        AITripRequest request,
        AIItineraryResponse itinerary,
        Instant createdAt
) {
}