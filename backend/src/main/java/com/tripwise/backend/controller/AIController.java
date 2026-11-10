package com.tripwise.backend.controller;

import com.tripwise.backend.ai.dto.request.AITripRequest;
import com.tripwise.backend.ai.dto.response.AIItineraryResponse;
import com.tripwise.backend.ai.dto.response.AIItineraryHistoryResponse;
import com.tripwise.backend.ai.service.AIItineraryService;
import com.tripwise.backend.ai.service.AIItineraryPersistenceService;
import com.tripwise.backend.ai.service.AIProviderClient;
import com.tripwise.backend.ai.service.AIUseCase;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@Validated
public class AIController {

    private final AIProviderClient aiProviderClient;
    private final AIItineraryService aiItineraryService;
    private final AIItineraryPersistenceService persistenceService;

    public AIController(
            AIProviderClient aiProviderClient,
            AIItineraryService aiItineraryService,
            AIItineraryPersistenceService persistenceService) {
        this.aiProviderClient = aiProviderClient;
        this.aiItineraryService = aiItineraryService;
        this.persistenceService = persistenceService;
    }

    @GetMapping("/test")
    public String testAI(
            @RequestParam(defaultValue = "Hello Gemini!")
            @Size(max = 500) String message,
            Authentication authentication) {

        return aiProviderClient.generateContent(
                authentication.getName(),
                "You are TripWise AI. Respond concisely.",
                message,
                AIUseCase.DIAGNOSTIC
        );
    }

    @PostMapping("/itinerary/generate")
    public ResponseEntity<AIItineraryHistoryResponse> generateItinerary(
            @Valid @RequestBody AITripRequest request,
            Authentication authentication) {

        AIItineraryResponse response =
                aiItineraryService.generateItinerary(
                        request,
                        authentication.getName()
                );

        AIItineraryHistoryResponse saved =
                persistenceService.saveItinerary(
                        authentication.getName(),
                        request,
                        response
                );

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/itinerary/history")
    public ResponseEntity<Page<AIItineraryHistoryResponse>> getHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        Page<AIItineraryHistoryResponse> history =
                persistenceService.getUserItineraries(
                        authentication.getName(),
                        page,
                        size
                );

        return ResponseEntity.ok(history);
    }

    @GetMapping("/itinerary/history/{id}")
    public ResponseEntity<AIItineraryHistoryResponse> getItinerary(
            @PathVariable Long id,
            Authentication authentication) {

        AIItineraryHistoryResponse response =
                persistenceService.getItineraryById(
                        id,
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/itinerary/history/{id}/regenerate")
    public ResponseEntity<AIItineraryHistoryResponse> regenerateItinerary(
            @PathVariable Long id,
            Authentication authentication) {

        AIItineraryHistoryResponse response =
                persistenceService.regenerateItinerary(
                        id,
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/itinerary/history/{id}")
    public ResponseEntity<Void> deleteItinerary(
            @PathVariable Long id,
            Authentication authentication) {

        persistenceService.deleteItinerary(
                id,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }
}