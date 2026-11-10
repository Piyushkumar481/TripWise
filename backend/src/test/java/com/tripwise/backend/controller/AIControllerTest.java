package com.tripwise.backend.controller;

import com.tripwise.backend.ai.service.AIItineraryPersistenceService;
import com.tripwise.backend.ai.service.AIItineraryService;
import com.tripwise.backend.ai.service.AIProviderClient;
import com.tripwise.backend.ai.service.AIUseCase;
import jakarta.validation.constraints.Size;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AIControllerTest {

    @Test
    void testEndpointUsesAuthenticatedIdentityForQuotaOwnership() {
        AIProviderClient providerClient = mock(AIProviderClient.class);
        AIController controller = new AIController(
                providerClient,
                mock(AIItineraryService.class),
                mock(AIItineraryPersistenceService.class)
        );
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("jwt-user@example.com");
        when(providerClient.generateContent(
                "jwt-user@example.com",
                "You are TripWise AI. Respond concisely.",
                "Test prompt",
                AIUseCase.DIAGNOSTIC
        )).thenReturn("response");

        assertEquals(
                "response",
                controller.testAI("Test prompt", authentication)
        );

        verify(providerClient).generateContent(
                "jwt-user@example.com",
                "You are TripWise AI. Respond concisely.",
                "Test prompt",
                AIUseCase.DIAGNOSTIC
        );
    }

    @Test
    void testEndpointMessageHasFiveHundredCharacterLimit() throws Exception {
        Method endpoint = AIController.class.getMethod(
                "testAI",
                String.class,
                Authentication.class
        );
        Parameter message = endpoint.getParameters()[0];
        Size size = message.getAnnotation(Size.class);

        assertNotNull(size);
        assertEquals(500, size.max());
    }
}
