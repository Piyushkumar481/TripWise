package com.tripwise.backend.ai.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record AITravelRecommendationRequest(

        @Size(max = 500)
        String interests,

        @Min(0)
        @Max(1000000)
        Integer budget,

        @Size(max = 10)
        List<@NotBlank @Size(max = 40) String> categories,

        @Min(1)
        @Max(20)
        Integer numberOfRecommendations

) {
}