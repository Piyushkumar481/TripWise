package com.tripwise.backend.service.impl;

import com.tripwise.backend.exception.DocumentNotFoundException;
import com.tripwise.backend.service.interfaces.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class LocalStorageService implements StorageService {

    private static final Pattern SAFE_FILENAME =
            Pattern.compile(
                    "^[a-fA-F0-9-]{36}\\.[a-zA-Z0-9]{1,10}$"
            );

    private final Path storageLocation;

    public LocalStorageService(
            @Value("${tripwise.documents.storage.local-directory:${file.storage.location:uploads}}")
            String location) {

        this.storageLocation = Paths.get(location)
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(this.storageLocation);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Could not create storage directory",
                    exception
            );
        }
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

        String extension = StringUtils.getFilenameExtension(
                originalFileName
        );

        if (extension == null
                || !extension.matches("[a-zA-Z0-9]{1,10}")) {
            throw new IllegalArgumentException(
                    "A valid file extension is required"
            );
        }

        String storedFileName =
                UUID.randomUUID() + "." + extension.toLowerCase();

        Path targetLocation = resolveSafePath(storedFileName);

        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetLocation);
            return storedFileName;
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Could not store file",
                    exception
            );
        }
    }

    @Override
    public Resource load(String storedFileName) {
        Path file = resolveSafePath(storedFileName);

        if (!Files.isRegularFile(file) || !Files.isReadable(file)) {
            throw new DocumentNotFoundException(
                    "Stored document file was not found"
            );
        }

        Resource resource = new FileSystemResource(file);

        if (!resource.exists() || !resource.isReadable()) {
            throw new DocumentNotFoundException(
                    "Stored document file was not found"
            );
        }

        return resource;
    }

    @Override
    public void delete(String storedFileName) {
        Path file = resolveSafePath(storedFileName);

        try {
            Files.deleteIfExists(file);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Could not delete file",
                    exception
            );
        }
    }

    private Path resolveSafePath(String storedFileName) {
        if (storedFileName == null
                || !SAFE_FILENAME.matcher(storedFileName).matches()) {
            throw new IllegalArgumentException(
                    "Invalid stored filename"
            );
        }

        Path resolved = storageLocation.resolve(storedFileName)
                .normalize();

        if (!resolved.startsWith(storageLocation)
                || resolved.equals(storageLocation)) {
            throw new IllegalArgumentException(
                    "Invalid storage path"
            );
        }

        return resolved;
    }
}