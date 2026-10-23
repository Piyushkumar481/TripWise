package com.tripwise.backend.service.impl;

import com.azure.core.util.BinaryData;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.tripwise.backend.exception.DocumentNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class AzureBlobStorageServiceTest {

    private BlobContainerClient containerClient;
    private BlobClient blobClient;
    private AzureBlobStorageService storageService;

    @BeforeEach
    void setUp() {
        containerClient = mock(BlobContainerClient.class);
        blobClient = mock(BlobClient.class);

        storageService = new AzureBlobStorageService(containerClient);

        when(containerClient.getBlobClient(any(String.class)))
                .thenReturn(blobClient);
    }

    @Test
    void storeShouldUploadFileAndReturnUniqueFilename() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "ticket.pdf",
                "application/pdf",
                "%PDF-1.7 sample".getBytes()
        );

        String storedName = storageService.store(file);

        assertTrue(storedName.matches(
                "^[a-fA-F0-9-]{36}\\.pdf$"
        ));

        verify(containerClient).createIfNotExists();
        verify(blobClient).upload(
                any(java.io.InputStream.class),
                anyLong(),
                eq(false)
        );
    }

    @Test
    void loadShouldReturnDownloadedFileContents() throws IOException {
        byte[] expected = "%PDF-1.7 sample".getBytes();

        when(blobClient.exists()).thenReturn(true);
        when(blobClient.downloadContent())
                .thenReturn(BinaryData.fromBytes(expected));

        Resource resource = storageService.load(
                "12345678-1234-1234-1234-123456789012.pdf"
        );

        assertArrayEquals(
                expected,
                resource.getInputStream().readAllBytes()
        );
    }

    @Test
    void loadShouldThrowWhenFileDoesNotExist() {
        when(blobClient.exists()).thenReturn(false);

        assertThrows(
                DocumentNotFoundException.class,
                () -> storageService.load(
                        "12345678-1234-1234-1234-123456789012.pdf"
                )
        );
    }

    @Test
    void deleteShouldDeleteBlobIfItExists() {
        String storedName =
                "12345678-1234-1234-1234-123456789012.pdf";

        storageService.delete(storedName);

        verify(blobClient).deleteIfExists();
    }

    @Test
    void loadShouldRejectInvalidFilename() {
        assertThrows(
                IllegalArgumentException.class,
                () -> storageService.load("../outside.pdf")
        );

        verifyNoInteractions(containerClient);
    }

    @Test
    void storeShouldRejectEmptyFile() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "empty.pdf",
                "application/pdf",
                new byte[0]
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> storageService.store(file)
        );

        verifyNoInteractions(containerClient);
    }
}