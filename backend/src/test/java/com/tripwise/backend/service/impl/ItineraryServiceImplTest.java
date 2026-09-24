package com.tripwise.backend.service.impl;

import com.tripwise.backend.dto.CreateItineraryItemRequest;
import com.tripwise.backend.dto.ItineraryItemResponse;
import com.tripwise.backend.entity.ItineraryCategory;
import com.tripwise.backend.entity.ItineraryItem;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.repository.ItineraryItemRepository;
import com.tripwise.backend.repository.TripRepository;
import com.tripwise.backend.repository.UserRepository;
import com.tripwise.backend.service.impl.ItineraryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItineraryServiceImplTest {

    @Mock
    private ItineraryItemRepository itineraryRepository;

    @Mock
    private TripRepository tripRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ItineraryServiceImpl itineraryService;

    private Trip trip;
    private CreateItineraryItemRequest request;

    @BeforeEach
    void setUp() {

        trip = Trip.builder()
                .id(1L)
                .title("Goa Beach Escape")
                .destinationCountry("India")
                .destinationCity("Goa")
                .startDate(LocalDate.of(2026, 10, 10))
                .endDate(LocalDate.of(2026, 10, 16))
                .budget(new BigDecimal("35000"))
                .build();

        request = new CreateItineraryItemRequest();
        request.setTitle("Visit Baga Beach");
        request.setActivityDate(LocalDate.of(2026, 10, 12));
        request.setStartTime(LocalTime.of(10, 0));
        request.setEndTime(LocalTime.of(12, 0));
        request.setCategory(ItineraryCategory.SIGHTSEEING);
        request.setLocation("Baga Beach");
        request.setNotes("Morning beach visit");
        request.setDisplayOrder(0);
    }

    @Test
    void shouldCreateItineraryItem() {

        when(tripRepository.findByIdAndUserEmail(
                1L,
                "user@example.com"
        )).thenReturn(Optional.of(trip));

        ItineraryItem savedItem = ItineraryItem.builder()
                .id(10L)
                .trip(trip)
                .title(request.getTitle())
                .activityDate(request.getActivityDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .category(request.getCategory())
                .location(request.getLocation())
                .notes(request.getNotes())
                .displayOrder(request.getDisplayOrder())
                .build();

        when(itineraryRepository.save(any(ItineraryItem.class)))
                .thenReturn(savedItem);

        ItineraryItemResponse response =
                itineraryService.createItem(
                        "user@example.com",
                        1L,
                        request
                );

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Visit Baga Beach", response.getTitle());
        assertEquals(LocalDate.of(2026, 10, 12), response.getActivityDate());

        verify(tripRepository)
                .findByIdAndUserEmail(
                        1L,
                        "user@example.com"
                );

        verify(itineraryRepository)
                .save(any(ItineraryItem.class));
    }

    @Test
    void shouldRejectItineraryDateOutsideTrip() {

        when(tripRepository.findByIdAndUserEmail(
                1L,
                "user@example.com"
        )).thenReturn(Optional.of(trip));

        request.setActivityDate(
                LocalDate.of(2026, 10, 20)
        );

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> itineraryService.createItem(
                                "user@example.com",
                                1L,
                                request
                        )
                );

        assertEquals(
                "Activity date must be within the trip dates",
                exception.getMessage()
        );

        verify(itineraryRepository, never())
                .save(any(ItineraryItem.class));
    }

    @Test
    void shouldRejectTripNotOwnedByUser() {

        when(tripRepository.findByIdAndUserEmail(
                1L,
                "attacker@example.com"
        )).thenReturn(Optional.empty());

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> itineraryService.createItem(
                                "attacker@example.com",
                                1L,
                                request
                        )
                );

        assertEquals(
                "Trip not found",
                exception.getMessage()
        );

        verify(itineraryRepository, never())
                .save(any(ItineraryItem.class));
    }

    @Test
    void shouldReturnItineraryItems() {

        when(tripRepository.findByIdAndUserEmail(
                1L,
                "user@example.com"
        )).thenReturn(Optional.of(trip));

        ItineraryItem item = ItineraryItem.builder()
                .id(10L)
                .trip(trip)
                .title("Visit Baga Beach")
                .activityDate(LocalDate.of(2026, 10, 12))
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(12, 0))
                .category(ItineraryCategory.SIGHTSEEING)
                .location("Baga Beach")
                .build();

        when(itineraryRepository
                .findByTripOrderByActivityDateAscStartTimeAscDisplayOrderAsc(trip))
                .thenReturn(List.of(item));

        List<ItineraryItemResponse> response =
                itineraryService.getItems(
                        "user@example.com",
                        1L
                );

        assertEquals(1, response.size());
        assertEquals(
                "Visit Baga Beach",
                response.get(0).getTitle()
        );
        assertEquals(
                LocalDate.of(2026, 10, 12),
                response.get(0).getActivityDate()
        );
    }

    @Test
    void shouldDeleteItineraryItem() {

        when(tripRepository.findByIdAndUserEmail(
                1L,
                "user@example.com"
        )).thenReturn(Optional.of(trip));

        ItineraryItem item = ItineraryItem.builder()
                .id(10L)
                .trip(trip)
                .title("Visit Baga Beach")
                .activityDate(LocalDate.of(2026, 10, 12))
                .category(ItineraryCategory.SIGHTSEEING)
                .build();

        when(itineraryRepository
                .findByIdAndTrip(10L, trip))
                .thenReturn(Optional.of(item));

        itineraryService.deleteItem(
                "user@example.com",
                1L,
                10L
        );

        verify(itineraryRepository)
                .delete(item);
    }
}
