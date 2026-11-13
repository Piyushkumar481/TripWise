package com.tripwise.backend.ai.service;

import com.tripwise.backend.ai.dto.AITravelChatRequest;
import com.tripwise.backend.ai.repository.AIItineraryRepository;
import com.tripwise.backend.exception.AIQuotaExceededException;
import com.tripwise.backend.exception.AIServiceUnavailableException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Answers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AITravelChatServiceTest {

    @Mock
    private AIProviderClient aiProviderClient;

    @Mock
    private AIItineraryRepository itineraryRepository;

    @Mock
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    private AITravelChatService service;

    @BeforeEach
    void setUp() {
        aiProviderClient = mock(AIProviderClient.class);
        service = new AITravelChatService(
                aiProviderClient,
                itineraryRepository,
                objectMapper
        );
    }

    @Test
    void mapsQuotaFailureToAIQuotaExceededException() {
        when(aiProviderClient.generateContent(
                eq("test@example.com"),
                anyString(),
                anyString(),
                eq(AIUseCase.CHAT)
        )).thenThrow(new RuntimeException("429 quota exceeded"));

        assertThrows(
                AIQuotaExceededException.class,
                () -> service.chat(request(), "test@example.com")
        );
    }

    @Test
    void mapsUnavailableProviderToAIServiceUnavailableException() {
        when(aiProviderClient.generateContent(
                eq("test@example.com"),
                anyString(),
                anyString(),
                eq(AIUseCase.CHAT)
        )).thenThrow(new RuntimeException("503 service unavailable"));

        assertThrows(
                AIServiceUnavailableException.class,
                () -> service.chat(request(), "test@example.com")
        );
    }

    @Test
    void rethrowsUnexpectedProviderFailures() {
        RuntimeException providerFailure =
                new RuntimeException("Unexpected provider failure");

        when(aiProviderClient.generateContent(
                eq("test@example.com"),
                anyString(),
                anyString(),
                eq(AIUseCase.CHAT)
        )).thenThrow(providerFailure);

        RuntimeException actual = assertThrows(
                RuntimeException.class,
                () -> service.chat(request(), "test@example.com")
        );

        assertSame(providerFailure, actual);
    }

    private AITravelChatRequest request() {
        AITravelChatRequest request = mock(AITravelChatRequest.class);

        when(request.getItineraryId()).thenReturn(null);
        when(request.getMessage()).thenReturn("Suggest a weekend trip.");

        return request;
    }
}