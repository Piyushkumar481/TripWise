package com.tripwise.backend.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AIItineraryModificationRequest(

        @NotBlank(message = "Modification request is required")
        @Size(max = 2000, message = "Request must not exceed 2000 characters")
        String modificationRequest

) {
}