package com.tripwise.testsupport;

import org.junit.jupiter.api.Test;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertySourcesPropertyResolver;
import org.springframework.core.env.SystemEnvironmentPropertySource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ComposeConfigurationTest {

    @Test
    void composePassesRequiredSpringPlaceholdersAndUsesSafeStorageDefault()
            throws IOException {

        String compose = Files.readString(
                Path.of("..", "docker-compose.yml")
        );

        assertTrue(compose.contains("GEMINI_API_KEY: ${GEMINI_API_KEY}"));
        assertTrue(compose.contains(
                "CORS_ALLOWED_ORIGINS: ${CORS_ALLOWED_ORIGINS}"
        ));
        assertTrue(compose.contains(
                "APP_CORS_ALLOWED_ORIGINS: ${CORS_ALLOWED_ORIGINS}"
        ));
        assertTrue(compose.contains(
                "TRIPWISE_STORAGE_PROVIDER: ${TRIPWISE_STORAGE_PROVIDER:-local}"
        ));
    }

    @Test
    void composeCorsVariableBindsToSpringPropertyAndResolvesProfilePlaceholder() {
        String allowedOrigins = "https://tripwise.example";
        MutablePropertySources sources = new MutablePropertySources();
        sources.addFirst(new SystemEnvironmentPropertySource(
                "compose",
                Map.of(
                        "APP_CORS_ALLOWED_ORIGINS", allowedOrigins,
                        "CORS_ALLOWED_ORIGINS", allowedOrigins,
                        "GEMINI_API_KEY", "test-api-key"
                )
        ));
        PropertySourcesPropertyResolver resolver =
                new PropertySourcesPropertyResolver(sources);

        assertEquals(
                allowedOrigins,
                resolver.getProperty("app.cors.allowed-origins")
        );
        assertEquals(
                allowedOrigins,
                resolver.resolveRequiredPlaceholders(
                        "${CORS_ALLOWED_ORIGINS}"
                )
        );
        assertEquals(
                "test-api-key",
                resolver.resolveRequiredPlaceholders("${GEMINI_API_KEY}")
        );
    }
}
