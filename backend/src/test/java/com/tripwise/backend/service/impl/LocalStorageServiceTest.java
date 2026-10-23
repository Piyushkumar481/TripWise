package com.tripwise.backend.service.impl;

import com.tripwise.backend.exception.DocumentNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class LocalStorageServiceTest {

    @TempDir
    Path temporaryDirectory;

    private LocalStorageService storageService;

    @BeforeEach
    void setUp() {
        storageService = new LocalStorageService(
                temporaryDirectory.resolve("documents").toString());
    }

    @Test
    void storeShouldCreateUniqueStoredFilename() {
        MockMultipartFile firstFile = new MockMultipartFile(
                "file",
                "ticket.pdf",
                "application/pdf",
                "%PDF-1.7 first".getBytes());

        MockMultipartFile secondFile = new MockMultipartFile(
                "file",
                "ticket.pdf",
                "application/pdf",
                "%PDF-1.7 second".getBytes());

        String firstStoredName = storageService.store(firstFile);
        String secondStoredName = storageService.store(secondFile);

        assertNotEquals(firstStoredName, secondStoredName);
        assertTrue(firstStoredName.matches(
                "^[a-fA-F0-9-]{36}\\.pdf$"));
        assertTrue(secondStoredName.matches(
                "^[a-fA-F0-9-]{36}\\.pdf$"));
    }

    @Test
    void loadShouldReturnStoredFileContents() throws IOException {
        byte[] expected = "%PDF-1.7 sample".getBytes();

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "ticket.pdf",
                "application/pdf",
                expected);

        String storedName = storageService.store(file);

        Resource resource = storageService.load(storedName);

        assertTrue(resource.exists());
        assertArrayEquals(expected, resource.getInputStream().readAllBytes());
    }

    @Test
    void deleteShouldRemoveStoredFile() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "ticket.pdf",
                "application/pdf",
                "%PDF-1.7 sample".getBytes());

        String storedName = storageService.store(file);

        storageService.delete(storedName);

        assertThrows(
                DocumentNotFoundException.class,
                () -> storageService.load(storedName));
    }

    @Test
    void loadShouldRejectInvalidStoredFilename() {
        assertThrows(
                IllegalArgumentException.class,
                () -> storageService.load("../outside.pdf"));
    }

    @Test
    void deleteShouldRejectInvalidStoredFilename() {
        assertThrows(
                IllegalArgumentException.class,
                () -> storageService.delete("../../outside.pdf"));
    }

    @Test
    void loadShouldRejectMissingFile() {
        String missingFile = "12345678-1234-1234-1234-123456789012.pdf";

        assertThrows(
                DocumentNotFoundException.class,
                () -> storageService.load(missingFile));
    }

    @Test
    void storeShouldRejectEmptyFile() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "empty.pdf",
                "application/pdf",
                new byte[0]);

        assertThrows(
                IllegalArgumentException.class,
                () -> storageService.store(file));
    }

    @Test
    void storeShouldRejectFilenameWithoutExtension() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "document",
                "application/pdf",
                "%PDF-1.7 sample".getBytes());

        assertThrows(
                IllegalArgumentException.class,
                () -> storageService.store(file));
    }
}