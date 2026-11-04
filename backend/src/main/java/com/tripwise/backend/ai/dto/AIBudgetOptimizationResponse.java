package com.tripwise.backend.ai.dto;

import java.util.List;

public record AIBudgetOptimizationResponse(

        Long itineraryId,

        Integer originalEstimatedCost,

        Integer optimizedEstimatedCost,

        Integer estimatedSavings,

        String budgetStatus,

        List<CostSavingSuggestion> suggestions,

        String optimizationSummary

) {

    public record CostSavingSuggestion(

            String category,

            String currentExpense,

            String proposedAlternative,

            Integer estimatedOriginalCost,

            Integer estimatedAlternativeCost,

            Integer estimatedSavings,

            String reason,

            String confidence

    ) {
    }
}