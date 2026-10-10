package com.tripwise.backend.service;

import com.tripwise.backend.dto.DocumentRequest;
import com.tripwise.backend.dto.TripDocumentResponse;
import com.tripwise.backend.entity.DocumentCategory;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.TripDocument;
import com.tripwise.backend.exception.DocumentNotFoundException;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.repository.TripDocumentRepository;
import com.tripwise.backend.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TripDocumentService {

    private final TripDocumentRepository tripDocumentRepository;
    private final TripRepository tripRepository;

    public List<TripDocumentResponse> getDocuments(
            Long tripId,
            String userEmail) {

        getOwnedTrip(tripId, userEmail);

        return tripDocumentRepository
                .findByTripIdOrderByUploadedAtDesc(tripId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public TripDocumentResponse createDocument(
            Long tripId,
            DocumentRequest request,
            String userEmail) {

        Trip trip = getOwnedTrip(tripId, userEmail);
        validateRequest(request);

        /*
         * This lesson creates metadata only.
         * Real file uploads will be implemented separately.
         */
        TripDocument document = TripDocument.builder()
                .trip(trip)
                .title(request.getTitle().trim())
                .description(normalizeOptionalText(request.getDescription()))
                .originalFileName("PENDING_UPLOAD")
                .storageKey("pending/" + UUID.randomUUID())
                .contentType("application/octet-stream")
                .fileSize(1L)
                .category(request.getCategory().name())
                .build();

        return mapToResponse(tripDocumentRepository.save(document));
    }

    @Transactional
    public TripDocumentResponse updateDocument(
            Long tripId,
            Long documentId,
            DocumentRequest request,
            String userEmail) {

        getOwnedTrip(tripId, userEmail);
        validateRequest(request);

        TripDocument document = tripDocumentRepository
                .findByIdAndTripId(documentId, tripId)
                .orElseThrow(() ->
                        new DocumentNotFoundException(
                                "Document not found"));

        document.setTitle(request.getTitle().trim());
        document.setDescription(
                normalizeOptionalText(request.getDescription()));
        document.setCategory(request.getCategory().name());

        return mapToResponse(tripDocumentRepository.save(document));
    }

    @Transactional
    public void deleteDocument(
            Long tripId,
            Long documentId,
            String userEmail) {

        getOwnedTrip(tripId, userEmail);

        TripDocument document = tripDocumentRepository
                .findByIdAndTripId(documentId, tripId)
                .orElseThrow(() ->
                        new DocumentNotFoundException(
                                "Document not found"));

        tripDocumentRepository.delete(document);
    }

    private Trip getOwnedTrip(Long tripId, String userEmail) {
        return tripRepository
                .findByIdAndUserEmail(tripId, userEmail)
                .orElseThrow(() ->
                        new TripNotFoundException("Trip not found"));
    }

    private void validateRequest(DocumentRequest request) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Document request is required");
        }

        if (request.getTitle() == null
                || request.getTitle().isBlank()) {
            throw new IllegalArgumentException(
                    "Document title is required");
        }

        if (request.getTitle().trim().length() > 150) {
            throw new IllegalArgumentException(
                    "Document title must not exceed 150 characters");
        }

        if (request.getDescription() != null
                && request.getDescription().length() > 500) {
            throw new IllegalArgumentException(
                    "Description must not exceed 500 characters");
        }

        if (request.getCategory() == null) {
            throw new IllegalArgumentException(
                    "Document category is required");
        }
    }

    private String normalizeOptionalText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private TripDocumentResponse mapToResponse(TripDocument document) {
        DocumentCategory category;

        try {
            category = DocumentCategory.valueOf(
                    document.getCategory().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException | NullPointerException exception) {
            category = DocumentCategory.OTHER;
        }

        return TripDocumentResponse.builder()
                .id(document.getId())
                .tripId(document.getTrip().getId())
                .title(document.getTitle())
                .description(document.getDescription())
                .originalFileName(document.getOriginalFileName())
                .category(category)
                .contentType(document.getContentType())
                .fileSize(document.getFileSize())
                .uploadedAt(document.getUploadedAt())
                .build();
    }
}
