package com.tripwise.backend.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AIItineraryModificationConfirmRequest(

        @NotBlank(message = "Original itinerary is required")
        @Size(max = 2000000, message = "Original itinerary is too large")
        String originalItinerary,

        @NotBlank(message = "Modified itinerary is required")
        @Size(max = 2000000, message = "Modified itinerary is too large")
        String modifiedItinerary

) {
}