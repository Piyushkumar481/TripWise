package com.tripwise.backend.service;

import com.tripwise.backend.config.DocumentValidationProperties;
import com.tripwise.backend.exception.InvalidFileException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DocumentFileValidator {

    private static final Map<String, String> EXTENSION_TO_CONTENT_TYPE =
            Map.of(
                    "pdf", "application/pdf",
                    "jpg", "image/jpeg",
                    "jpeg", "image/jpeg",
                    "png", "image/png"
            );

    private static final byte[] PDF_SIGNATURE =
            new byte[] { '%', 'P', 'D', 'F', '-' };

    private static final byte[] PNG_SIGNATURE =
            new byte[] {
                    (byte) 0x89, 0x50, 0x4E, 0x47,
                    0x0D, 0x0A, 0x1A, 0x0A
            };

    private final DocumentValidationProperties properties;

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File cannot be empty");
        }

        if (file.getSize() > properties.getMaxFileSizeBytes()) {
            throw new InvalidFileException("File size cannot exceed 10 MB");
        }

        String originalFilename =
                StringUtils.cleanPath(file.getOriginalFilename() == null
                        ? ""
                        : file.getOriginalFilename());

        if (originalFilename.isBlank()
                || originalFilename.endsWith("/")
                || originalFilename.endsWith("\\")) {
            throw new InvalidFileException("A valid filename is required");
        }

        String contentType = file.getContentType();

        Set<String> allowedTypes = properties.getAllowedContentTypes();

        if (contentType == null || allowedTypes == null
                || !allowedTypes.contains(contentType)) {
            throw new InvalidFileException(
                    "Only PDF, JPEG and PNG files are allowed");
        }

        int lastDot = originalFilename.lastIndexOf('.');

        if (lastDot < 0 || lastDot == originalFilename.length() - 1) {
            throw new InvalidFileException(
                    "File must have a PDF, JPG, JPEG or PNG extension");
        }

        String extension = originalFilename.substring(lastDot + 1)
                .toLowerCase(Locale.ROOT);

        String expectedContentType =
                EXTENSION_TO_CONTENT_TYPE.get(extension);

        if (expectedContentType == null
                || !expectedContentType.equals(contentType)) {
            throw new InvalidFileException(
                    "File extension does not match its content type");
        }

        try {
            byte[] header = file.getBytes();

            if (!hasValidSignature(header, contentType)) {
                throw new InvalidFileException(
                        "File content does not match its declared type");
            }
        } catch (IOException exception) {
            throw new InvalidFileException(
                    "Unable to read uploaded file");
        }
    }

    private boolean hasValidSignature(
            byte[] bytes,
            String contentType) {

        if ("application/pdf".equals(contentType)) {
            return startsWith(bytes, PDF_SIGNATURE);
        }

        if ("image/png".equals(contentType)) {
            return startsWith(bytes, PNG_SIGNATURE);
        }

        if ("image/jpeg".equals(contentType)) {
            return bytes.length >= 3
                    && (bytes[0] & 0xFF) == 0xFF
                    && (bytes[1] & 0xFF) == 0xD8
                    && (bytes[2] & 0xFF) == 0xFF;
        }

        return false;
    }

    private boolean startsWith(byte[] bytes, byte[] signature) {
        if (bytes.length < signature.length) {
            return false;
        }

        for (int i = 0; i < signature.length; i++) {
            if (bytes[i] != signature[i]) {
                return false;
            }
        }

        return true;
    }
}
