package com.tripwise.backend.ai.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AIBudgetOptimizationRequest(

        @NotNull(message = "Total budget is required")
        @Min(value = 1, message = "Budget must be positive")
        @Max(value = 10000000, message = "Budget cannot exceed 10,000,000")
        Integer totalBudget,

        @Min(value = 0, message = "Daily budget cannot be negative")
        @Max(value = 1000000)
        Integer dailyBudget,

        @Size(min = 3, max = 3)
        @Pattern(regexp = "[A-Z]{3}", message = "Currency must be an ISO currency code")
        String currency,

        @Size(max = 500, message = "Priorities cannot exceed 500 characters")
        String priorities

) {
}