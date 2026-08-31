package com.tripwise.backend.service;

import com.tripwise.backend.dto.TripRequest;
import com.tripwise.backend.dto.TripResponse;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.User;
import com.tripwise.backend.repository.TripRepository;
import com.tripwise.backend.repository.UserRepository;
import com.tripwise.backend.service.impl.TripServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TripServiceImplTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TripServiceImpl tripService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldCreateTripSuccessfully() {

        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        TripRequest request = new TripRequest();

        request.setTitle("Hyderabad Trip");
        request.setDestinationCountry("India");
        request.setDestinationCity("Hyderabad");
        request.setStartDate(
                LocalDate.now().plusDays(10)
        );
        request.setEndDate(
                LocalDate.now().plusDays(15)
        );
        request.setBudget(
                BigDecimal.valueOf(15000)
        );

        when(userRepository.findByEmail(
                "test@example.com"
        )).thenReturn(Optional.of(user));

        Trip savedTrip =
                Trip.builder()
                        .id(1L)
                        .user(user)
                        .title("Hyderabad Trip")
                        .destinationCountry("India")
                        .destinationCity("Hyderabad")
                        .startDate(
                                request.getStartDate()
                        )
                        .endDate(
                                request.getEndDate()
                        )
                        .budget(
                                request.getBudget()
                        )
                        .status(
                                com.tripwise.backend.entity.TripStatus.PLANNED
                        )
                        .build();

        when(tripRepository.save(
                any(Trip.class)
        )).thenReturn(savedTrip);

        TripResponse response =
                tripService.createTrip(
                        "test@example.com",
                        request
                );

        assertNotNull(response);

        assertEquals(
                "Hyderabad Trip",
                response.getTitle()
        );

        assertEquals(
                BigDecimal.valueOf(15000),
                response.getBudget()
        );

        verify(userRepository)
                .findByEmail("test@example.com");

        verify(tripRepository)
                .save(any(Trip.class));
    }

    @Test
    void shouldRejectInvalidTripDates() {

        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        when(userRepository.findByEmail(
                "test@example.com"
        )).thenReturn(Optional.of(user));

        TripRequest request = new TripRequest();

        request.setTitle("Invalid Trip");
        request.setDestinationCountry("India");
        request.setDestinationCity("Delhi");

        request.setStartDate(
                LocalDate.of(2026, 9, 20)
        );

        request.setEndDate(
                LocalDate.of(2026, 9, 10)
        );

        request.setBudget(
                BigDecimal.valueOf(10000)
        );

        assertThrows(
                com.tripwise.backend.exception.InvalidTripDateException.class,
                () ->
                        tripService.createTrip(
                                "test@example.com",
                                request
                        )
        );

        verify(tripRepository, never())
                .save(any(Trip.class));
    }

    @Test
    void shouldThrowExceptionWhenTripDoesNotExist() {

        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        when(userRepository.findByEmail(
                "test@example.com"
        )).thenReturn(Optional.of(user));

        when(tripRepository.findByIdAndUserId(
                999L,
                user.getId()
        )).thenReturn(Optional.empty());

        assertThrows(
                com.tripwise.backend.exception.TripNotFoundException.class,
                () ->
                        tripService.getTripById(
                                "test@example.com",
                                999L
                        )
        );

        verify(tripRepository)
                .findByIdAndUserId(
                        999L,
                        user.getId()
                );
    }
}