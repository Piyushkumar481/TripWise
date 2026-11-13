package com.tripwise.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private static final String SECRET =
            "TripWiseSecurityTestSecretKey12345678901234567890";

    private JwtService createService(String secret, long expiration) {
        return createService(secret, expiration, "test");
    }

    private JwtService createService(
            String secret,
            long expiration,
            String... profiles) {
        JwtService service = new JwtService();
        ReflectionTestUtils.setField(service, "secret", secret);
        ReflectionTestUtils.setField(service, "expiration", expiration);
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles(profiles);
        ReflectionTestUtils.setField(
                service,
                "environment",
                environment
        );
        return service;
    }

    @Test
    void shouldRejectMissingSecretAtStartupValidation() {
        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> createService(null, 60000, "prod")
                        .validateConfiguredSecret()
        );

        assertEquals(
                "JWT_SECRET must be configured and non-blank.",
                exception.getMessage()
        );
    }

    @Test
    void shouldRejectBlankSecretAtStartupValidation() {
        assertThrows(
                IllegalStateException.class,
                () -> createService("   ", 60000, "prod")
                        .validateConfiguredSecret()
        );
    }

    @Test
    void shouldRejectSecretBelowMinimumHmacStrength() {
        String secret = "x".repeat(31);

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> createService(secret, 60000, "prod")
                        .validateConfiguredSecret()
        );

        assertFalse(exception.getMessage().contains(secret));
    }

    @Test
    void shouldRejectExamplePlaceholderInProduction() {
        String placeholder = "replace-with-a-strong-random-secret";

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> createService(placeholder, 60000, "prod")
                        .validateConfiguredSecret()
        );

        assertFalse(exception.getMessage().contains(placeholder));
    }

    @Test
    void shouldAllowExamplePlaceholderOutsideProduction() {
        assertDoesNotThrow(() ->
                createService(
                        "replace-with-a-strong-random-secret",
                        60000,
                        "dev"
                ).validateConfiguredSecret()
        );
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