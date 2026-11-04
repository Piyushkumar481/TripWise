package com.tripwise.backend.controller;

import com.tripwise.backend.ai.dto.AITravelRecommendationRequest;
import com.tripwise.backend.ai.dto.AITravelRecommendationResponse;
import com.tripwise.backend.ai.service.AITravelRecommendationService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/itineraries")
public class AITravelRecommendationController {

    private final AITravelRecommendationService recommendationService;

    public AITravelRecommendationController(
            AITravelRecommendationService recommendationService) {

        this.recommendationService = recommendationService;
    }

    @PostMapping("/{itineraryId}/recommendations")
    public ResponseEntity<AITravelRecommendationResponse> getRecommendations(
            @PathVariable Long itineraryId,
            @Valid @RequestBody AITravelRecommendationRequest request,
            Authentication authentication) {

        String authenticatedUserEmail = authentication.getName();

        AITravelRecommendationResponse response =
                recommendationService.generateRecommendations(
                        itineraryId,
                        authenticatedUserEmail,
                        request
                );

        return ResponseEntity.ok(response);
    }
}