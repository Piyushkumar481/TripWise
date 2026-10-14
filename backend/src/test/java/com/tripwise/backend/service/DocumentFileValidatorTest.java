package com.tripwise.backend.service;

import com.tripwise.backend.config.DocumentValidationProperties;
import com.tripwise.backend.exception.InvalidFileException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.*;

class DocumentFileValidatorTest {

    private DocumentValidationProperties properties;
    private DocumentFileValidator validator;

    @BeforeEach
    void setUp() {
        properties = new DocumentValidationProperties();
        validator = new DocumentFileValidator(properties);
    }

    @Test
    void validateShouldAcceptPdfWithValidSignature() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "ticket.pdf",
                "application/pdf",
                "%PDF-1.7 sample".getBytes());

        assertDoesNotThrow(() -> validator.validate(file));
    }

    @Test
    void validateShouldAcceptPngWithValidSignature() {
        byte[] signature = new byte[] {
                (byte) 0x89, 0x50, 0x4E, 0x47,
                0x0D, 0x0A, 0x1A, 0x0A
        };

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "photo.png",
                "image/png",
                signature);

        assertDoesNotThrow(() -> validator.validate(file));
    }

    @Test
    void validateShouldAcceptJpegWithValidSignature() {
        byte[] signature = new byte[] {
                (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0x00
        };

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "photo.jpg",
                "image/jpeg",
                signature);

        assertDoesNotThrow(() -> validator.validate(file));
    }

    @Test
    void validateShouldRejectEmptyFile() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "empty.pdf", "application/pdf", new byte[0]);

        assertThrows(
                InvalidFileException.class,
                () -> validator.validate(file));
    }

    @Test
    void validateShouldRejectUnsupportedContentType() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "script.exe",
                "application/octet-stream",
                "content".getBytes());

        assertThrows(
                InvalidFileException.class,
                () -> validator.validate(file));
    }

    @Test
    void validateShouldRejectMismatchedExtension() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "photo.png",
                "application/pdf",
                "%PDF-1.7 sample".getBytes());

        assertThrows(
                InvalidFileException.class,
                () -> validator.validate(file));
    }

    @Test
    void validateShouldRejectInvalidPdfSignature() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "fake.pdf",
                "application/pdf",
                "This is not a PDF".getBytes());

        assertThrows(
                InvalidFileException.class,
                () -> validator.validate(file));
    }

    @Test
    void validateShouldRejectMissingFilename() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "",
                "application/pdf",
                "%PDF-1.7 sample".getBytes());

        assertThrows(
                InvalidFileException.class,
                () -> validator.validate(file));
    }

    @Test
    void validateShouldRejectFileAboveSizeLimit() {
        byte[] oversizedContent = new byte[
                Math.toIntExact(properties.getMaxFileSizeBytes() + 1)];

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "large.pdf",
                "application/pdf",
                oversizedContent);

        assertThrows(
                InvalidFileException.class,
                () -> validator.validate(file));
    }
}