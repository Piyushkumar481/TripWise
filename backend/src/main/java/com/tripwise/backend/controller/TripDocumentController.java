package com.tripwise.backend.controller;

import com.tripwise.backend.dto.ApiResponse;
import com.tripwise.backend.dto.DocumentRequest;
import com.tripwise.backend.dto.TripDocumentResponse;
import com.tripwise.backend.service.TripDocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/document-metadata")
@RequiredArgsConstructor
public class TripDocumentController {

    private final TripDocumentService tripDocumentService;

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