package com.tripwise.backend.controller;

import com.tripwise.backend.ai.dto.AIItineraryModificationRequest;
import com.tripwise.backend.ai.dto.AIItineraryModificationConfirmRequest;
import com.tripwise.backend.ai.dto.AIItineraryModificationResponse;
import com.tripwise.backend.ai.service.AIItineraryModificationService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai/itineraries")
public class AIItineraryModificationController {

    private final AIItineraryModificationService modificationService;

    public AIItineraryModificationController(
            AIItineraryModificationService modificationService) {

        this.modificationService = modificationService;
    }

    @PostMapping("/{itineraryId}/modify-preview")
    public ResponseEntity<AIItineraryModificationResponse> previewModification(
            @PathVariable Long itineraryId,
            @Valid @RequestBody AIItineraryModificationRequest request,
            Authentication authentication) {

        String authenticatedUserEmail = authentication.getName();

        AIItineraryModificationResponse response =
                modificationService.previewModification(
                        itineraryId,
                        authenticatedUserEmail,
                        request
                );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{itineraryId}/modify-confirm")
    public ResponseEntity<Map<String, String>> confirmModification(
            @PathVariable Long itineraryId,
            @Valid @RequestBody AIItineraryModificationConfirmRequest request,
            Authentication authentication) {

        modificationService.confirmModification(
                itineraryId,
                authentication.getName(),
                request
        );

        return ResponseEntity.ok(
                Map.of(
                        "message", "Your itinerary has been updated successfully.",
                        "itineraryId", itineraryId.toString()
                )
        );
    }
}