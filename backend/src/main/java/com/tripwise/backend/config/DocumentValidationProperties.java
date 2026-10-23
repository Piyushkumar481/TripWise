package com.tripwise.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Set;

@Getter
@Setter
@ConfigurationProperties(prefix = "tripwise.documents")
public class DocumentValidationProperties {

    private long maxFileSizeBytes = 10 * 1024 * 1024;

    private Set<String> allowedContentTypes = Set.of(
        "application/pdf",
        "image/jpeg",
        "image/png"
    );
}
