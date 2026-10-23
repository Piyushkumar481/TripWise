package com.tripwise.backend.service;

import com.tripwise.backend.dto.TripNoteRequest;
import com.tripwise.backend.dto.TripNoteResponse;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.TripNote;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.repository.TripNoteRepository;
import com.tripwise.backend.repository.TripRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TripNoteService {

    private final TripNoteRepository tripNoteRepository;
    private final TripRepository tripRepository;

    public List<TripNoteResponse> getNotes(Long tripId, String userEmail) {
        getOwnedTrip(tripId, userEmail);

        return tripNoteRepository
                .findByTripIdOrderByPinnedDescUpdatedAtDesc(tripId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TripNoteResponse getNote(
            Long tripId,
            Long noteId,
            String userEmail) {

        getOwnedTrip(tripId, userEmail);

        return mapToResponse(findNote(tripId, noteId));
    }

    @Transactional
    public TripNoteResponse createNote(
            Long tripId,
            TripNoteRequest request,
            String userEmail) {

        Trip trip = getOwnedTrip(tripId, userEmail);
        validateRequest(request);

        TripNote note = TripNote.builder()
                .trip(trip)
                .title(request.getTitle().trim())
                .content(request.getContent().trim())
                .pinned(Boolean.TRUE.equals(request.getPinned()))
                .build();

        return mapToResponse(tripNoteRepository.save(note));
    }

    @Transactional
    public TripNoteResponse updateNote(
            Long tripId,
            Long noteId,
            TripNoteRequest request,
            String userEmail) {

        getOwnedTrip(tripId, userEmail);
        validateRequest(request);

        TripNote note = findNote(tripId, noteId);

        note.setTitle(request.getTitle().trim());
        note.setContent(request.getContent().trim());

        if (request.getPinned() != null) {
            note.setPinned(request.getPinned());
        }

        return mapToResponse(tripNoteRepository.save(note));
    }

    @Transactional
    public TripNoteResponse updatePinnedStatus(
            Long tripId,
            Long noteId,
            Boolean pinned,
            String userEmail) {

        getOwnedTrip(tripId, userEmail);

        if (pinned == null) {
            throw new IllegalArgumentException("Pinned status is required");
        }

        TripNote note = findNote(tripId, noteId);
        note.setPinned(pinned);

        return mapToResponse(tripNoteRepository.save(note));
    }

    @Transactional
    public void deleteNote(Long tripId, Long noteId, String userEmail) {
        getOwnedTrip(tripId, userEmail);
        tripNoteRepository.delete(findNote(tripId, noteId));
    }

    public long getTotalNotes(Long tripId, String userEmail) {
        getOwnedTrip(tripId, userEmail);
        return tripNoteRepository.countByTripId(tripId);
    }

    public long getPinnedNotes(Long tripId, String userEmail) {
        getOwnedTrip(tripId, userEmail);
        return tripNoteRepository.countByTripIdAndPinned(tripId, true);
    }

    private Trip getOwnedTrip(Long tripId, String userEmail) {
        return tripRepository.findByIdAndUserEmail(tripId, userEmail)
                .orElseThrow(() -> new TripNotFoundException("Trip not found"));
    }

    private TripNote findNote(Long tripId, Long noteId) {
        return tripNoteRepository.findByIdAndTripId(noteId, tripId)
                .orElseThrow(() -> new TripNotFoundException("Note not found"));
    }

    private void validateRequest(TripNoteRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Note details are required");
        }

        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new IllegalArgumentException("Note title is required");
        }

        if (request.getTitle().trim().length() > 150) {
            throw new IllegalArgumentException(
                    "Note title must not exceed 150 characters");
        }

        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new IllegalArgumentException("Note content is required");
        }

        if (request.getContent().trim().length() > 20000) {
            throw new IllegalArgumentException(
                    "Note content must not exceed 20000 characters");
        }
    }

    private TripNoteResponse mapToResponse(TripNote note) {
        return TripNoteResponse.builder()
                .id(note.getId())
                .tripId(note.getTrip().getId())
                .title(note.getTitle())
                .content(note.getContent())
                .pinned(note.isPinned())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }
}