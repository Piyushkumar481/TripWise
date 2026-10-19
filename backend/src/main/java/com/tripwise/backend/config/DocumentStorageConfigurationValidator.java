package com.tripwise.backend.config;

import org.springframework.context.annotation.Configuration;

import java.util.Locale;
import java.util.Set;

@Configuration
public class DocumentStorageConfigurationValidator {

    private static final Set<String> SUPPORTED_PROVIDERS =
            Set.of("local", "azure");

    public DocumentStorageConfigurationValidator(
            DocumentStorageProperties properties) {

        String provider = properties.getProvider();

        if (provider == null
                || !SUPPORTED_PROVIDERS.contains(
                        provider.toLowerCase(Locale.ROOT))) {
            throw new IllegalStateException(
                    "Unsupported document storage provider: "
                            + provider
                            + ". Supported providers are: local, azure."
            );
        }
    }
}