package com.tripwise.backend.ai.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record AIItineraryResponse(
        String title,
        String destination,
        String summary,
        Integer duration,
        BigDecimal totalEstimatedCost,
        String currency,
        List<DayPlan> itinerary,
        CostBreakdown costBreakdown,
        List<String> travelTips
) {
    public record DayPlan(
            Integer day,
            String title,
            String description,
            List<Activity> activities
    ) {
    }

    public record Activity(
            String time,
            String name,
            String location,
            String description,
            BigDecimal estimatedCost,
            String transportSuggestion
    ) {
    }

    public record CostBreakdown(
            BigDecimal transportation,
            BigDecimal accommodation,
            BigDecimal food,
            BigDecimal activities,
            BigDecimal miscellaneous
    ) {
    }
}