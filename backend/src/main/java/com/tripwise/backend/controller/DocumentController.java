package com.tripwise.backend.controller;

import com.tripwise.backend.dto.ApiResponse;
import com.tripwise.backend.dto.DocumentResponse;
import com.tripwise.backend.entity.DocumentType;
import com.tripwise.backend.service.interfaces.DocumentService;

import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/documents")
@RequiredArgsConstructor
@Tag(
        name = "Documents",
        description = "Trip document management APIs"
)
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<DocumentResponse>>
    uploadDocument(
            Authentication authentication,
            @PathVariable Long tripId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") DocumentType documentType) {

        DocumentResponse document =
                documentService.uploadDocument(
                        authentication.getName(),
                        tripId,
                        file,
                        documentType
                );

        ApiResponse<DocumentResponse> response =
                ApiResponse.<DocumentResponse>builder()
                        .success(true)
                        .message("Document uploaded successfully.")
                        .data(document)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentResponse>>>
    getDocuments(
            Authentication authentication,
            @PathVariable Long tripId) {

        List<DocumentResponse> documents =
                documentService.getDocuments(
                        authentication.getName(),
                        tripId
                );

        ApiResponse<List<DocumentResponse>> response =
                ApiResponse.<List<DocumentResponse>>builder()
                        .success(true)
                        .message("Documents retrieved successfully.")
                        .data(documents)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{documentId:\\d+}")
    public ResponseEntity<ApiResponse<DocumentResponse>>
    getDocument(
            Authentication authentication,
            @PathVariable Long tripId,
            @PathVariable Long documentId) {

        DocumentResponse document =
                documentService.getDocument(
                        authentication.getName(),
                        tripId,
                        documentId
                );

        ApiResponse<DocumentResponse> response =
                ApiResponse.<DocumentResponse>builder()
                        .success(true)
                        .message("Document retrieved successfully.")
                        .data(document)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{documentId:\\d+}")
    public ResponseEntity<ApiResponse<Void>>
    deleteDocument(
            Authentication authentication,
            @PathVariable Long tripId,
            @PathVariable Long documentId) {

        documentService.deleteDocument(
                authentication.getName(),
                tripId,
                documentId
        );

        ApiResponse<Void> response =
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Document deleted successfully.")
                        .data(null)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }
}