package com.tripwise.backend.service.impl;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.tripwise.backend.exception.DocumentNotFoundException;
import com.tripwise.backend.service.interfaces.StorageService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;
import java.util.regex.Pattern;

public class AzureBlobStorageService implements StorageService {

    private static final Pattern SAFE_FILENAME =
            Pattern.compile(
                    "^[a-fA-F0-9-]{36}\\.[a-zA-Z0-9]{1,10}$"
            );

    private final BlobContainerClient containerClient;

    public AzureBlobStorageService(
            BlobContainerClient containerClient) {
        this.containerClient = containerClient;
    }

    @Override
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Cannot store an empty file"
            );
        }

        String originalFileName = StringUtils.cleanPath(
                file.getOriginalFilename() == null
                        ? ""
                        : file.getOriginalFilename()
        );

        String extension =
                StringUtils.getFilenameExtension(originalFileName);

        if (extension == null
                || !extension.matches("[a-zA-Z0-9]{1,10}")) {
            throw new IllegalArgumentException(
                    "A valid file extension is required"
            );
        }

        String storedFileName =
                UUID.randomUUID() + "." + extension.toLowerCase();

        try (var inputStream = file.getInputStream()) {
            containerClient.createIfNotExists();

            BlobClient blobClient =
                    containerClient.getBlobClient(storedFileName);

            blobClient.upload(inputStream, file.getSize(), false);

            return storedFileName;
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Could not read document for Azure storage",
                    exception
            );
        }
    }

    @Override
    public Resource load(String storedFileName) {
        validateStoredFileName(storedFileName);

        BlobClient blobClient =
                containerClient.getBlobClient(storedFileName);

        if (!blobClient.exists()) {
            throw new DocumentNotFoundException(
                    "Stored document file was not found"
            );
        }

        return new ByteArrayResource(
                blobClient.downloadContent().toBytes()
        );
    }

    @Override
    public void delete(String storedFileName) {
        validateStoredFileName(storedFileName);

        containerClient.getBlobClient(storedFileName).deleteIfExists();
    }

    private void validateStoredFileName(String storedFileName) {
        if (storedFileName == null
                || !SAFE_FILENAME.matcher(storedFileName).matches()) {
            throw new IllegalArgumentException(
                    "Invalid stored filename"
            );
        }
    }
}