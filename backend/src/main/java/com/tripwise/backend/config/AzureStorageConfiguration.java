package com.tripwise.backend.config;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.tripwise.backend.service.interfaces.StorageService;
import com.tripwise.backend.service.impl.AzureBlobStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(
        prefix = "tripwise.documents.storage",
        name = "provider",
        havingValue = "azure"
)
public class AzureStorageConfiguration {

    @Bean
    public BlobContainerClient azureBlobContainerClient(
            @Value("${tripwise.documents.storage.azure.connection-string:}")
            String connectionString,
            @Value("${tripwise.documents.storage.azure.container-name:tripwise-documents}")
            String containerName) {

        if (connectionString == null || connectionString.isBlank()) {
            throw new IllegalStateException(
                    "Azure storage is selected, but the "
                            + "AZURE_STORAGE_CONNECTION_STRING environment "
                            + "variable is not configured."
            );
        }

        return new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient()
                .getBlobContainerClient(containerName);
    }

    @Bean
    public StorageService azureBlobStorageService(
            BlobContainerClient azureBlobContainerClient) {
        return new AzureBlobStorageService(azureBlobContainerClient);
    }
}