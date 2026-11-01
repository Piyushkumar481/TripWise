package com.tripwise.backend.controller;

import com.tripwise.backend.ai.dto.request.AITripRequest;
import com.tripwise.backend.ai.dto.response.AIItineraryResponse;
import com.tripwise.backend.ai.service.AIItineraryService;
import jakarta.validation.Valid;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final ChatClient chatClient;
    private final AIItineraryService aiItineraryService;

    public AIController(
            ChatClient chatClient,
            AIItineraryService aiItineraryService) {
        this.chatClient = chatClient;
        this.aiItineraryService = aiItineraryService;
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
    public ResponseEntity<AIItineraryResponse> generateItinerary(
            @Valid @RequestBody AITripRequest request) {

        AIItineraryResponse response =
                aiItineraryService.generateItinerary(request);

        return ResponseEntity.ok(response);
    }
}