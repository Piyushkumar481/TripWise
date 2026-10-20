package com.tripwise.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import static org.junit.jupiter.api.Assertions.*;

class DocumentStorageConfigurationValidatorTest {

    private MockEnvironment environment(String profile) {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles(profile);
        return environment;
    }

    @Test
    void shouldAcceptLocalProviderInDevelopment() {
        DocumentStorageProperties properties = new DocumentStorageProperties();
        properties.setProvider("local");
        assertDoesNotThrow(() ->
                new DocumentStorageConfigurationValidator(properties, environment("dev")));
    }

    @Test
    void shouldAcceptAzureProviderInDevelopment() {
        DocumentStorageProperties properties = new DocumentStorageProperties();
        properties.setProvider("azure");
        assertDoesNotThrow(() ->
                new DocumentStorageConfigurationValidator(properties, environment("dev")));
    }

    @Test
    void shouldAcceptAzureProviderInProduction() {
        DocumentStorageProperties properties = new DocumentStorageProperties();
        properties.setProvider("azure");
        assertDoesNotThrow(() ->
                new DocumentStorageConfigurationValidator(properties, environment("prod")));
    }

    @Test
    void shouldRejectLocalProviderInProduction() {
        DocumentStorageProperties properties = new DocumentStorageProperties();
        properties.setProvider("local");

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> new DocumentStorageConfigurationValidator(properties, environment("prod")));

        assertTrue(exception.getMessage().contains("Production requires Azure document storage"));
    }

    @Test
    void shouldRejectUnsupportedProvider() {
        DocumentStorageProperties properties = new DocumentStorageProperties();
        properties.setProvider("azuer");

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> new DocumentStorageConfigurationValidator(properties, environment("dev")));

        assertTrue(exception.getMessage().contains("azuer"));
        assertTrue(exception.getMessage().contains("local, azure"));
    }

    @Test
    void shouldRejectNullProvider() {
        DocumentStorageProperties properties = new DocumentStorageProperties();
        properties.setProvider(null);
        assertThrows(IllegalStateException.class,
                () -> new DocumentStorageConfigurationValidator(properties, environment("dev")));
    }
}