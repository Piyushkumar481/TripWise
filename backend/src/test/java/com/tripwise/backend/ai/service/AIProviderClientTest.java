package com.tripwise.backend.ai.service;

import com.tripwise.backend.config.AIProtectionProperties;
import com.tripwise.backend.exception.AIOutputLimitExceededException;
import com.tripwise.backend.exception.AIRequestRateLimitExceededException;
import com.tripwise.backend.exception.AIUsageLimitStoreUnavailableException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.metadata.ChatGenerationMetadata;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AIProviderClientTest {

    private ChatClient chatClient;
    private ChatClient.ChatClientRequestSpec requestSpec;
    private ChatClient.CallResponseSpec responseSpec;
    private AIUsageRateLimiter rateLimiter;
    private AIProviderClient providerClient;

    @BeforeEach
    void setUp() {
        chatClient = mock(ChatClient.class);
        requestSpec = mock(ChatClient.ChatClientRequestSpec.class);
        responseSpec = mock(ChatClient.CallResponseSpec.class);
        rateLimiter = mock(AIUsageRateLimiter.class);

        AIProtectionProperties properties = new AIProtectionProperties();
        properties.getOutputTokens().setChat(1234);

        providerClient = new AIProviderClient(
                chatClient,
                rateLimiter,
                properties
        );

        when(chatClient.prompt()).thenReturn(requestSpec);
        when(requestSpec.options(any())).thenReturn(requestSpec);
        when(requestSpec.system("system")).thenReturn(requestSpec);
        when(requestSpec.user("prompt")).thenReturn(requestSpec);
        when(requestSpec.call()).thenReturn(responseSpec);
    }

    @Test
    void rejectsBeforeBuildingOrCallingProviderRequest() {
        doThrow(new AIRequestRateLimitExceededException(30))
                .when(rateLimiter)
                .consume("user@example.com");

        assertThrows(
                AIRequestRateLimitExceededException.class,
                () -> providerClient.generateContent(
                        "user@example.com",
                        "system",
                        "prompt",
                        AIUseCase.CHAT
                )
        );

        verify(chatClient, never()).prompt();
    }

    @Test
    void doesNotCallProviderWhenUsageStoreIsUnavailable() {
        doThrow(new AIUsageLimitStoreUnavailableException())
                .when(rateLimiter)
                .consume("user@example.com");

        assertThrows(
                AIUsageLimitStoreUnavailableException.class,
                () -> providerClient.generateContent(
                        "user@example.com",
                        "system",
                        "prompt",
                        AIUseCase.CHAT
                )
        );

        verify(chatClient, never()).prompt();
    }

    @Test
    void usesAuthenticatedIdentityAndConfiguredOutputLimit() {
        ChatResponse response = chatResponse("STOP");
        when(responseSpec.chatResponse()).thenReturn(response);
        when(responseSpec.content()).thenReturn("answer");

        assertEquals(
                "answer",
                providerClient.generateContent(
                        "user@example.com",
                        "system",
                        "prompt",
                        AIUseCase.CHAT
                )
        );

        verify(rateLimiter).consume("user@example.com");
        verify(requestSpec).options(any());
    }

    @Test
    void reportsProviderOutputLimitInsteadOfReturningTruncatedContent() {
        ChatResponse response = chatResponse("MAX_TOKENS");
        when(responseSpec.chatResponse()).thenReturn(response);

        assertThrows(
                AIOutputLimitExceededException.class,
                () -> providerClient.generateContent(
                        "user@example.com",
                        "system",
                        "prompt",
                        AIUseCase.CHAT
                )
        );

        verify(responseSpec, never()).content();
    }

    private ChatResponse chatResponse(String finishReason) {
        return new ChatResponse(java.util.List.of(
                new Generation(
                        new AssistantMessage("provider response"),
                        ChatGenerationMetadata.builder()
                                .finishReason(finishReason)
                                .build()
                )
        ));
    }
}
