package com.tripwise.backend.config;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DocumentStorageConfigurationValidatorTest {

    @Test
    void shouldAcceptLocalProvider() {
        DocumentStorageProperties properties =
                new DocumentStorageProperties();
        properties.setProvider("local");

        assertDoesNotThrow(
                () -> new DocumentStorageConfigurationValidator(properties));
    }

    @Test
    void shouldAcceptAzureProvider() {
        DocumentStorageProperties properties =
                new DocumentStorageProperties();
        properties.setProvider("azure");

        assertDoesNotThrow(
                () -> new DocumentStorageConfigurationValidator(properties));
    }

    @Test
    void shouldRejectUnsupportedProvider() {
        DocumentStorageProperties properties =
                new DocumentStorageProperties();
        properties.setProvider("azuer");

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> new DocumentStorageConfigurationValidator(properties)
        );

        assertTrue(exception.getMessage().contains("azuer"));
        assertTrue(exception.getMessage().contains("local, azure"));
    }

    @Test
    void shouldRejectNullProvider() {
        DocumentStorageProperties properties =
                new DocumentStorageProperties();
        properties.setProvider(null);

        assertThrows(
                IllegalStateException.class,
                () -> new DocumentStorageConfigurationValidator(properties)
        );
    }
}