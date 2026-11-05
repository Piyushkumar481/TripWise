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

import org.springframework.ai.chat.client.ChatClient;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AITravelChatServiceTest {

    @Mock
    private ChatClient.Builder chatClientBuilder;

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private ChatClient chatClient;

    @Mock
    private AIItineraryRepository itineraryRepository;

    @Mock
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    private AITravelChatService service;

    @BeforeEach
    void setUp() {
        when(chatClientBuilder.build()).thenReturn(chatClient);

        service = new AITravelChatService(
                chatClientBuilder,
                itineraryRepository,
                objectMapper
        );
    }

    @Test
    void mapsQuotaFailureToAIQuotaExceededException() {
        when(chatClient.prompt()
                .system(anyString())
                .user(anyString())
                .call()
                .content())
                .thenThrow(new RuntimeException("429 quota exceeded"));

        assertThrows(
                AIQuotaExceededException.class,
                () -> service.chat(request(), "test@example.com")
        );
    }

    @Test
    void mapsUnavailableProviderToAIServiceUnavailableException() {
        when(chatClient.prompt()
                .system(anyString())
                .user(anyString())
                .call()
                .content())
                .thenThrow(new RuntimeException("503 service unavailable"));

        assertThrows(
                AIServiceUnavailableException.class,
                () -> service.chat(request(), "test@example.com")
        );
    }

    @Test
    void rethrowsUnexpectedProviderFailures() {
        RuntimeException providerFailure =
                new RuntimeException("Unexpected provider failure");

        when(chatClient.prompt()
                .system(anyString())
                .user(anyString())
                .call()
                .content())
                .thenThrow(providerFailure);

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