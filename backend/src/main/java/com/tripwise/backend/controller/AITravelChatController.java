package com.tripwise.backend.controller;

import com.tripwise.backend.ai.dto.AITravelChatRequest;
import com.tripwise.backend.ai.dto.AITravelChatResponse;
import com.tripwise.backend.ai.service.AITravelChatService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/travel-chat")
public class AITravelChatController {

    private final AITravelChatService chatService;

    public AITravelChatController(AITravelChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<AITravelChatResponse> chat(
            @Valid @RequestBody AITravelChatRequest request,
            Authentication authentication) {

        String authenticatedUserEmail = authentication.getName();

        String answer = chatService.chat(
                request,
                authenticatedUserEmail
        );

        return ResponseEntity.ok(
                new AITravelChatResponse(answer)
        );
    }
}