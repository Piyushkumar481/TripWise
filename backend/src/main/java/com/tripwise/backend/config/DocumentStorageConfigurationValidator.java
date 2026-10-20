package com.tripwise.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;
import java.util.Locale;
import java.util.Set;

@Configuration
public class DocumentStorageConfigurationValidator {

    private static final Set<String> SUPPORTED_PROVIDERS =
            Set.of("local", "azure");

    public DocumentStorageConfigurationValidator(
            DocumentStorageProperties properties,
            Environment environment) {

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

        boolean productionActive = Arrays.stream(environment.getActiveProfiles())
                .anyMatch("prod"::equalsIgnoreCase);

        if (productionActive && !"azure".equalsIgnoreCase(provider)) {
            throw new IllegalStateException(
                    "Production requires Azure document storage."
            );
        }
    }
}