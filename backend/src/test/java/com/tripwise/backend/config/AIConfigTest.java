package com.tripwise.backend.config;

import com.google.genai.Client;
import org.junit.jupiter.api.Test;
import org.springframework.ai.model.google.genai.autoconfigure.chat.GoogleGenAiConnectionProperties;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AIConfigTest {

    @Test
    void googleGenAiClientUsesOneHttpAttemptAndKeepsApiKeyConfiguration()
            throws Exception {

        GoogleGenAiConnectionProperties properties =
                new GoogleGenAiConnectionProperties();
        properties.setApiKey("test-api-key");

        try (Client client = new AIConfig()
                .rateLimitedGoogleGenAiClient(properties)) {
            assertEquals("test-api-key", client.apiKey());
        }

        assertEquals(
                1,
                AIConfig.singleAttemptHttpOptions()
                        .retryOptions()
                        .orElseThrow()
                        .attempts()
                        .orElseThrow()
        );
    }
}
