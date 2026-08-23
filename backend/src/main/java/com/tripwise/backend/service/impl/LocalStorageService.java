package com.tripwise.backend.service.impl;

import com.tripwise.backend.service.interfaces.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    private final Path storageLocation;

    public LocalStorageService(
            @Value("${file.storage.location:uploads}") String location) {

        this.storageLocation =
                Paths.get(location)
                        .toAbsolutePath()
                        .normalize();

        try {
            Files.createDirectories(this.storageLocation);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not create storage directory",
                    e
            );
        }
    }

    @Override
    public String store(MultipartFile file) {

        String originalFileName =
                StringUtils.cleanPath(
                        file.getOriginalFilename()
                );

        String extension = "";

        int lastDot =
                originalFileName.lastIndexOf('.');

        if (lastDot >= 0) {
            extension =
                    originalFileName.substring(lastDot);
        }

        String storedFileName =
                UUID.randomUUID() + extension;

        Path targetLocation =
                storageLocation.resolve(storedFileName);

        try {

            Files.copy(
                    file.getInputStream(),
                    targetLocation
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not store file",
                    e
            );
        }

        return storedFileName;
    }

    @Override
    public void delete(String storedFileName) {

        try {

            Path file =
                    storageLocation.resolve(storedFileName)
                            .normalize();

            Files.deleteIfExists(file);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not delete file",
                    e
            );
        }
    }
}