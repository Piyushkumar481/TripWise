package com.tripwise.backend.controller;

import com.tripwise.backend.dto.ApiResponse;
import com.tripwise.backend.dto.TripNoteRequest;
import com.tripwise.backend.dto.TripNoteResponse;
import com.tripwise.backend.service.TripNoteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips/{tripId}/notes")
@RequiredArgsConstructor
public class TripNoteController {

    private final TripNoteService tripNoteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TripNoteResponse>>> getNotes(
            @PathVariable Long tripId,
            Authentication authentication) {

        List<TripNoteResponse> notes =
                tripNoteService.getNotes(tripId, authentication.getName());

        return ResponseEntity.ok(
                ApiResponse.<List<TripNoteResponse>>builder()
                        .success(true)
                        .message("Trip notes retrieved successfully.")
                        .data(notes)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @GetMapping("/{noteId}")
    public ResponseEntity<ApiResponse<TripNoteResponse>> getNote(
            @PathVariable Long tripId,
            @PathVariable Long noteId,
            Authentication authentication) {

        TripNoteResponse note =
                tripNoteService.getNote(
                        tripId, noteId, authentication.getName());

        return ResponseEntity.ok(
                ApiResponse.<TripNoteResponse>builder()
                        .success(true)
                        .message("Trip note retrieved successfully.")
                        .data(note)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TripNoteResponse>> createNote(
            @PathVariable Long tripId,
            @Valid @RequestBody TripNoteRequest request,
            Authentication authentication) {

        TripNoteResponse note =
                tripNoteService.createNote(
                        tripId, request, authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<TripNoteResponse>builder()
                        .success(true)
                        .message("Trip note created successfully.")
                        .data(note)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @PutMapping("/{noteId}")
    public ResponseEntity<ApiResponse<TripNoteResponse>> updateNote(
            @PathVariable Long tripId,
            @PathVariable Long noteId,
            @Valid @RequestBody TripNoteRequest request,
            Authentication authentication) {

        TripNoteResponse note =
                tripNoteService.updateNote(
                        tripId, noteId, request, authentication.getName());

        return ResponseEntity.ok(
                ApiResponse.<TripNoteResponse>builder()
                        .success(true)
                        .message("Trip note updated successfully.")
                        .data(note)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @PatchMapping("/{noteId}/pinned")
    public ResponseEntity<ApiResponse<TripNoteResponse>> updatePinnedStatus(
            @PathVariable Long tripId,
            @PathVariable Long noteId,
            @RequestBody(required = false) PinnedStatusRequest request,
            Authentication authentication) {

        if (request == null || request.pinned() == null) {
            throw new IllegalArgumentException("Pinned status is required.");
        }

        TripNoteResponse note =
                tripNoteService.updatePinnedStatus(
                        tripId,
                        noteId,
                        request.pinned(),
                        authentication.getName());

        return ResponseEntity.ok(
                ApiResponse.<TripNoteResponse>builder()
                        .success(true)
                        .message("Trip note pin status updated successfully.")
                        .data(note)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable Long tripId,
            @PathVariable Long noteId,
            Authentication authentication) {

        tripNoteService.deleteNote(
                tripId, noteId, authentication.getName());

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getSummary(
            @PathVariable Long tripId,
            Authentication authentication) {

        String userEmail = authentication.getName();

        long totalNotes =
                tripNoteService.getTotalNotes(tripId, userEmail);

        long pinnedNotes =
                tripNoteService.getPinnedNotes(tripId, userEmail);

        Map<String, Long> summary = Map.of(
                "totalNotes", totalNotes,
                "pinnedNotes", pinnedNotes,
                "unpinnedNotes", totalNotes - pinnedNotes
        );

        return ResponseEntity.ok(
                ApiResponse.<Map<String, Long>>builder()
                        .success(true)
                        .message("Trip notes summary retrieved successfully.")
                        .data(summary)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    public record PinnedStatusRequest(Boolean pinned) {
    }
}
