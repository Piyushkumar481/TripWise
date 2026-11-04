package com.tripwise.backend.ai.dto;

import java.util.List;

public record AITravelRecommendationResponse(

        Long itineraryId,

        List<Recommendation> recommendations,

        String generalAdvice

) {

    public record Recommendation(

            String name,

            String category,

            String description,

            String reason,

            String estimatedCost,

            String suggestedDay,

            String location,

            String priceConfidence

    ) {
    }
}