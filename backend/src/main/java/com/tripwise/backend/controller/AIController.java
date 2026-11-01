package com.tripwise.backend.controller;

import com.tripwise.backend.ai.dto.request.AITripRequest;
import com.tripwise.backend.ai.dto.response.AIItineraryResponse;
import com.tripwise.backend.ai.dto.response.AIItineraryHistoryResponse;
import com.tripwise.backend.ai.service.AIItineraryService;
import com.tripwise.backend.ai.service.AIItineraryPersistenceService;

import jakarta.validation.Valid;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final ChatClient chatClient;
    private final AIItineraryService aiItineraryService;
    private final AIItineraryPersistenceService persistenceService;

    public AIController(
            ChatClient chatClient,
            AIItineraryService aiItineraryService,
            AIItineraryPersistenceService persistenceService) {
        this.chatClient = chatClient;
        this.aiItineraryService = aiItineraryService;
        this.persistenceService = persistenceService;
    }

    @GetMapping("/test")
    public String testAI(
            @RequestParam(defaultValue = "Hello Gemini!") String message) {

        return chatClient.prompt()
                .user(message)
                .call()
                .content();
    }

    @PostMapping("/itinerary/generate")
    public ResponseEntity<AIItineraryHistoryResponse> generateItinerary(
            @Valid @RequestBody AITripRequest request,
            Authentication authentication) {

        AIItineraryResponse response =
                aiItineraryService.generateItinerary(request);

        AIItineraryHistoryResponse saved =
                persistenceService.saveItinerary(
                        authentication.getName(),
                        request,
                        response
                );

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/itinerary/history")
    public ResponseEntity<List<AIItineraryHistoryResponse>> getHistory(
            Authentication authentication) {

        List<AIItineraryHistoryResponse> history =
                persistenceService.getUserItineraries(
                        authentication.getName()
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
}