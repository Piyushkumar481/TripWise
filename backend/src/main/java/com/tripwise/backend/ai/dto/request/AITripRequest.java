package com.tripwise.backend.ai.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record AITripRequest(
        @NotBlank(message = "Destination is required")
        @Size(max = 100, message = "Destination cannot exceed 100 characters")
        String destination,

        @NotBlank(message = "Starting location is required")
        @Size(max = 100, message = "Starting location cannot exceed 100 characters")
        String startingLocation,

        @NotNull(message = "Duration is required")
        @Min(value = 1, message = "Trip duration must be at least 1 day")
        @Max(value = 30, message = "Trip duration cannot exceed 30 days")
        Integer duration,

        @NotNull(message = "Budget is required")
        @DecimalMin(value = "1.00", message = "Budget must be greater than zero")
        BigDecimal budget,

        @NotNull(message = "Number of travellers is required")
        @Min(value = 1, message = "At least one traveller is required")
        @Max(value = 20, message = "Maximum 20 travellers allowed")
        Integer travelers,

        @NotEmpty(message = "At least one interest is required")
        @Size(max = 10, message = "Maximum 10 interests allowed")
        List<
                @NotBlank(message = "Interest cannot be empty")
                @Size(max = 50, message = "Interest cannot exceed 50 characters")
                String
        > interests,

        @NotBlank(message = "Travel style is required")
        @Size(max = 50, message = "Travel style cannot exceed 50 characters")
        String travelStyle
) {
}