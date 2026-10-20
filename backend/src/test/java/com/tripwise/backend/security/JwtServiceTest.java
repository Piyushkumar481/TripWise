package com.tripwise.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private static final String SECRET =
            "TripWiseSecurityTestSecretKey12345678901234567890";

    private JwtService createService(String secret, long expiration) {
        JwtService service = new JwtService();
        ReflectionTestUtils.setField(service, "secret", secret);
        ReflectionTestUtils.setField(service, "expiration", expiration);
        return service;
    }

    @Test
    void shouldGenerateAndValidateToken() {
        JwtService service = createService(SECRET, 60000);
        String token = service.generateToken("user@example.com");

        assertEquals("user@example.com", service.extractEmail(token));
        assertTrue(service.isTokenValid(token, "user@example.com"));
    }

    @Test
    void shouldRejectTokenForDifferentEmail() {
        JwtService service = createService(SECRET, 60000);
        String token = service.generateToken("user@example.com");

        assertFalse(service.isTokenValid(token, "other@example.com"));
    }

    @Test
    void shouldRejectMalformedToken() {
        JwtService service = createService(SECRET, 60000);

        assertThrows(RuntimeException.class,
                () -> service.extractEmail("not-a-valid-jwt"));
    }

    @Test
    void shouldRejectExpiredToken() {
        JwtService service = createService(SECRET, -1000);
        String token = service.generateToken("user@example.com");

        assertThrows(RuntimeException.class,
                () -> service.extractEmail(token));
    }

    @Test
    void shouldRejectTokenSignedWithDifferentSecret() {
        JwtService issuer = createService(SECRET, 60000);
        JwtService verifier = createService(
                "DifferentTripWiseTestSecretKey12345678901234567890",
                60000
        );
        String token = issuer.generateToken("user@example.com");

        assertThrows(RuntimeException.class,
                () -> verifier.extractEmail(token));
    }
}