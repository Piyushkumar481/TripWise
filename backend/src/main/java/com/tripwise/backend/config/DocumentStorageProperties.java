package com.tripwise.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "tripwise.documents.storage")
public class DocumentStorageProperties {

    private String provider = "local";

    private String localDirectory = "./storage/documents";
}
