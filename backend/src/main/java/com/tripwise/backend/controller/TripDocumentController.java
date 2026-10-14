package com.tripwise.backend.controller;

import com.tripwise.backend.dto.ApiResponse;
import com.tripwise.backend.dto.DocumentRequest;
import com.tripwise.backend.dto.TripDocumentResponse;
import com.tripwise.backend.service.TripDocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/document-metadata")
@RequiredArgsConstructor
public class TripDocumentController {

    private final TripDocumentService tripDocumentService;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<TripDocumentResponse>> uploadDocument(
            @PathVariable Long tripId,
            @RequestPart("file") MultipartFile file,
            @Valid @RequestPart("metadata") DocumentRequest request,
            Authentication authentication) {

        TripDocumentResponse uploadedDocument =
                tripDocumentService.uploadDocument(
                        tripId,
                        request,
                        file,
                        authentication.getName()
                );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<TripDocumentResponse>builder()
                                .success(true)
                                .message("Document uploaded successfully.")
                                .data(uploadedDocument)
                                .timestamp(LocalDateTime.now())
                                .build()
                );
    }

    @GetMapping("/{documentId}/download")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable Long tripId,
            @PathVariable Long documentId,
            Authentication authentication) {

        com.tripwise.backend.dto.DocumentDownload download =
                tripDocumentService.downloadDocument(
                        tripId,
                        documentId,
                        authentication.getName());

        MediaType contentType;

        try {
            contentType = MediaType.parseMediaType(download.contentType());
        } catch (IllegalArgumentException | NullPointerException exception) {
            contentType = MediaType.APPLICATION_OCTET_STREAM;
        }

        String originalFileName = download.originalFileName();

        if (originalFileName == null || originalFileName.isBlank()) {
            originalFileName = "document";
        }

        originalFileName = originalFileName
                .replace("\r", "")
                .replace("\n", "");

        return ResponseEntity.ok()
                .contentType(contentType)
                .contentLength(download.fileSize())
                .header(
                        org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        org.springframework.http.ContentDisposition
                                .attachment()
                                .filename(
                                        originalFileName,
                                        java.nio.charset.StandardCharsets.UTF_8)
                                .build()
                                .toString())
                .header("X-Content-Type-Options", "nosniff")
                .body(download.resource());
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<TripDocumentResponse>>> getDocuments(
            @PathVariable Long tripId,
            Authentication authentication) {

        List<TripDocumentResponse> documents =
                tripDocumentService.getDocuments(
                        tripId,
                        authentication.getName()
                );

        return ResponseEntity.ok(
                ApiResponse.<List<TripDocumentResponse>>builder()
                        .success(true)
                        .message("Documents retrieved successfully.")
                        .data(documents)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @PutMapping("/{documentId}")
    public ResponseEntity<ApiResponse<TripDocumentResponse>> updateDocument(
            @PathVariable Long tripId,
            @PathVariable Long documentId,
            @Valid @RequestBody DocumentRequest request,
            Authentication authentication) {

        TripDocumentResponse updatedDocument =
                tripDocumentService.updateDocument(
                        tripId,
                        documentId,
                        request,
                        authentication.getName()
                );

        return ResponseEntity.ok(
                ApiResponse.<TripDocumentResponse>builder()
                        .success(true)
                        .message("Document metadata updated successfully.")
                        .data(updatedDocument)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable Long tripId,
            @PathVariable Long documentId,
            Authentication authentication) {

        tripDocumentService.deleteDocument(
                tripId,
                documentId,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }
}