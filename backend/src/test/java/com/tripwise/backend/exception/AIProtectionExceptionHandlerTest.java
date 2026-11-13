package com.tripwise.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class AIProtectionExceptionHandlerTest {

    private final GlobalExceptionHandler handler =
            new GlobalExceptionHandler();

    @Test
    void rateLimitResponseIncludesRetryAfterAndGenericMessage() {
        HttpServletRequest request = request();

        ResponseEntity<ErrorResponse> response =
                handler.handleAIRequestRateLimitExceeded(
                        new AIRequestRateLimitExceededException(45),
                        request
                );

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, response.getStatusCode());
        assertEquals("45", response.getHeaders().getFirst("Retry-After"));
        assertEquals(
                "AI request limit exceeded. Please try again later.",
                response.getBody().getMessage()
        );
    }

    @Test
    void databaseFailureResponseDoesNotExposeInternalDetails() {
        ResponseEntity<ErrorResponse> response =
                handler.handleAIUsageLimitStoreUnavailable(
                        new AIUsageLimitStoreUnavailableException(),
                        request()
                );

        assertEquals(
                HttpStatus.SERVICE_UNAVAILABLE,
                response.getStatusCode()
        );
        assertFalse(response.getBody().getMessage().contains("SQL"));
        assertFalse(response.getBody().getMessage().contains("password"));
    }

    private HttpServletRequest request() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/ai/test");
        return request;
    }
}
