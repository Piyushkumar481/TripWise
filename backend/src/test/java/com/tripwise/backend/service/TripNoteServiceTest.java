package com.tripwise.backend.service;

import com.tripwise.backend.dto.TripNoteRequest;
import com.tripwise.backend.dto.TripNoteResponse;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.TripNote;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.repository.TripNoteRepository;
import com.tripwise.backend.repository.TripRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripNoteServiceTest {

    @Mock
    private TripNoteRepository tripNoteRepository;

    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private TripNoteService tripNoteService;

    private Trip trip;
    private TripNote note;

    private final String userEmail = "test@example.com";

    @BeforeEach
    void setUp() {
        trip = new Trip();
        trip.setId(1L);

        note = TripNote.builder()
                .id(10L)
                .trip(trip)
                .title("Flight details")
                .content("Flight departs at 9 AM")
                .pinned(false)
                .build();
    }

    @Test
    void getNotesShouldReturnNotesForOwnedTrip() {
        when(tripRepository.findByIdAndUserEmail(1L, userEmail))
                .thenReturn(Optional.of(trip));

        when(tripNoteRepository
                .findByTripIdOrderByPinnedDescUpdatedAtDesc(1L))
                .thenReturn(List.of(note));

        List<TripNoteResponse> result =
                tripNoteService.getNotes(1L, userEmail);

        assertEquals(1, result.size());
        assertEquals("Flight details", result.get(0).getTitle());
    }

    @Test
    void createNoteShouldTrimAndSaveFields() {
        TripNoteRequest request = new TripNoteRequest();
        request.setTitle("  Flight details  ");
        request.setContent("  Flight departs at 9 AM  ");

        when(tripRepository.findByIdAndUserEmail(1L, userEmail))
                .thenReturn(Optional.of(trip));

        when(tripNoteRepository.save(any(TripNote.class)))
                .thenAnswer(invocation -> {
                    TripNote saved = invocation.getArgument(0);
                    saved.setId(10L);
                    return saved;
                });

        TripNoteResponse result =
                tripNoteService.createNote(1L, request, userEmail);

        assertEquals("Flight details", result.getTitle());
        assertEquals("Flight departs at 9 AM", result.getContent());
        assertFalse(result.isPinned());
        verify(tripNoteRepository).save(any(TripNote.class));
    }

    @Test
    void createNoteShouldRejectBlankTitle() {
        TripNoteRequest request = new TripNoteRequest();
        request.setTitle("   ");
        request.setContent("Some content");

        when(tripRepository.findByIdAndUserEmail(1L, userEmail))
                .thenReturn(Optional.of(trip));

        assertThrows(IllegalArgumentException.class,
                () -> tripNoteService.createNote(1L, request, userEmail));

        verify(tripNoteRepository, never()).save(any(TripNote.class));
    }

    @Test
    void getNotesShouldRejectUnownedTrip() {
        when(tripRepository.findByIdAndUserEmail(1L, userEmail))
                .thenReturn(Optional.empty());

        assertThrows(TripNotFoundException.class,
                () -> tripNoteService.getNotes(1L, userEmail));

        verifyNoInteractions(tripNoteRepository);
    }

    @Test
    void updatePinnedStatusShouldPinNote() {
        when(tripRepository.findByIdAndUserEmail(1L, userEmail))
                .thenReturn(Optional.of(trip));
        when(tripNoteRepository.findByIdAndTripId(10L, 1L))
                .thenReturn(Optional.of(note));
        when(tripNoteRepository.save(any(TripNote.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TripNoteResponse result =
                tripNoteService.updatePinnedStatus(1L, 10L, true, userEmail);

        assertTrue(result.isPinned());
        verify(tripNoteRepository).save(note);
    }

    @Test
    void updatePinnedStatusShouldRejectNullValue() {
        when(tripRepository.findByIdAndUserEmail(1L, userEmail))
                .thenReturn(Optional.of(trip));

        assertThrows(IllegalArgumentException.class,
                () -> tripNoteService.updatePinnedStatus(
                        1L, 10L, null, userEmail));

        verify(tripNoteRepository, never()).save(any(TripNote.class));
    }

    @Test
    void deleteNoteShouldDeleteExistingNote() {
        when(tripRepository.findByIdAndUserEmail(1L, userEmail))
                .thenReturn(Optional.of(trip));
        when(tripNoteRepository.findByIdAndTripId(10L, 1L))
                .thenReturn(Optional.of(note));

        tripNoteService.deleteNote(1L, 10L, userEmail);

        verify(tripNoteRepository).delete(note);
    }

    @Test
    void getNoteShouldRejectMissingNote() {
        when(tripRepository.findByIdAndUserEmail(1L, userEmail))
                .thenReturn(Optional.of(trip));
        when(tripNoteRepository.findByIdAndTripId(99L, 1L))
                .thenReturn(Optional.empty());

        assertThrows(TripNotFoundException.class,
                () -> tripNoteService.getNote(1L, 99L, userEmail));
    }
}