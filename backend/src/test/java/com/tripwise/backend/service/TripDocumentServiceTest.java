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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripDocumentServiceTest {

    @Mock
    private TripDocumentRepository tripDocumentRepository;

    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private TripDocumentService tripDocumentService;

    private Trip trip;
    private DocumentRequest request;

    @BeforeEach
    void setUp() {
        trip = Trip.builder()
                .id(1L)
                .build();

        request = new DocumentRequest();
        request.setTitle("Flight Ticket");
        request.setDescription("Return flight booking");
        request.setCategory(DocumentCategory.FLIGHTS);
    }

    @Test
    void getDocumentsShouldReturnTripDocuments() {
        TripDocument document = createDocument();

        when(tripRepository.findByIdAndUserEmail(1L, "user@example.com"))
                .thenReturn(Optional.of(trip));
        when(tripDocumentRepository.findByTripIdOrderByUploadedAtDesc(1L))
                .thenReturn(List.of(document));

        List<TripDocumentResponse> result =
                tripDocumentService.getDocuments(1L, "user@example.com");

        assertEquals(1, result.size());
        assertEquals("Flight Ticket", result.get(0).getTitle());
        assertEquals(DocumentCategory.FLIGHTS, result.get(0).getCategory());
        assertFalse(result.get(0).toString().contains("test-storage-key"));

        verify(tripDocumentRepository)
                .findByTripIdOrderByUploadedAtDesc(1L);
    }

    @Test
    void getDocumentsShouldRejectUnownedTrip() {
        when(tripRepository.findByIdAndUserEmail(1L, "user@example.com"))
                .thenReturn(Optional.empty());

        assertThrows(
                TripNotFoundException.class,
                () -> tripDocumentService.getDocuments(1L, "user@example.com")
        );

        verifyNoInteractions(tripDocumentRepository);
    }

    @Test
    void createDocumentShouldSaveMetadata() {
        when(tripRepository.findByIdAndUserEmail(1L, "user@example.com"))
                .thenReturn(Optional.of(trip));
        when(tripDocumentRepository.save(any(TripDocument.class)))
                .thenAnswer(invocation -> {
                    TripDocument saved = invocation.getArgument(0);
                    saved.setId(100L);
                    saved.setUploadedAt(LocalDateTime.now());
                    return saved;
                });

        TripDocumentResponse result =
                tripDocumentService.createDocument(
                        1L, request, "user@example.com");

        assertEquals(100L, result.getId());
        assertEquals("Flight Ticket", result.getTitle());
        assertEquals(DocumentCategory.FLIGHTS, result.getCategory());

        verify(tripDocumentRepository).save(any(TripDocument.class));
    }

    @Test
    void createDocumentShouldRejectBlankTitle() {
        request.setTitle("   ");

        when(tripRepository.findByIdAndUserEmail(1L, "user@example.com"))
                .thenReturn(Optional.of(trip));

        assertThrows(
                IllegalArgumentException.class,
                () -> tripDocumentService.createDocument(
                        1L, request, "user@example.com")
        );

        verify(tripDocumentRepository, never()).save(any(TripDocument.class));
    }

    @Test
    void updateDocumentShouldUpdateMetadata() {
        TripDocument document = createDocument();
        request.setTitle("Updated Flight Ticket");
        request.setCategory(DocumentCategory.OTHER);

        when(tripRepository.findByIdAndUserEmail(1L, "user@example.com"))
                .thenReturn(Optional.of(trip));
        when(tripDocumentRepository.findByIdAndTripId(100L, 1L))
                .thenReturn(Optional.of(document));
        when(tripDocumentRepository.save(any(TripDocument.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TripDocumentResponse result =
                tripDocumentService.updateDocument(
                        1L, 100L, request, "user@example.com");

        assertEquals("Updated Flight Ticket", result.getTitle());
        assertEquals(DocumentCategory.OTHER, result.getCategory());
    }

    @Test
    void updateDocumentShouldRejectDocumentFromAnotherTrip() {
        when(tripRepository.findByIdAndUserEmail(1L, "user@example.com"))
                .thenReturn(Optional.of(trip));
        when(tripDocumentRepository.findByIdAndTripId(100L, 1L))
                .thenReturn(Optional.empty());

        assertThrows(
                DocumentNotFoundException.class,
                () -> tripDocumentService.updateDocument(
                        1L, 100L, request, "user@example.com")
        );

        verify(tripDocumentRepository, never()).save(any(TripDocument.class));
    }

    @Test
    void deleteDocumentShouldDeleteRecord() {
        TripDocument document = createDocument();

        when(tripRepository.findByIdAndUserEmail(1L, "user@example.com"))
                .thenReturn(Optional.of(trip));
        when(tripDocumentRepository.findByIdAndTripId(100L, 1L))
                .thenReturn(Optional.of(document));

        tripDocumentService.deleteDocument(1L, 100L, "user@example.com");

        verify(tripDocumentRepository).delete(document);
    }

    @Test
    void deleteDocumentShouldRejectMissingDocument() {
        when(tripRepository.findByIdAndUserEmail(1L, "user@example.com"))
                .thenReturn(Optional.of(trip));
        when(tripDocumentRepository.findByIdAndTripId(100L, 1L))
                .thenReturn(Optional.empty());

        assertThrows(
                DocumentNotFoundException.class,
                () -> tripDocumentService.deleteDocument(
                        1L, 100L, "user@example.com")
        );

        verify(tripDocumentRepository, never()).delete(any(TripDocument.class));
    }

    private TripDocument createDocument() {
        return TripDocument.builder()
                .id(100L)
                .trip(trip)
                .title("Flight Ticket")
                .description("Return flight booking")
                .originalFileName("flight.pdf")
                .storageKey("test-storage-key")
                .contentType("application/pdf")
                .fileSize(2048L)
                .category("FLIGHTS")
                .uploadedAt(LocalDateTime.now())
                .build();
    }
}
