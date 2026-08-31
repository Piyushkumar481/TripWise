package com.tripwise.backend.service;

import com.tripwise.backend.dto.DashboardResponse;
import com.tripwise.backend.entity.Expense;
import com.tripwise.backend.entity.ExpenseCategory;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.TripStatus;
import com.tripwise.backend.entity.User;
import com.tripwise.backend.repository.ExpenseRepository;
import com.tripwise.backend.repository.TripRepository;
import com.tripwise.backend.repository.UserRepository;
import com.tripwise.backend.service.impl.DashboardServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DashboardServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TripRepository tripRepository;

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldCalculateDashboardSuccessfully() {

        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        Trip trip1 = Trip.builder()
                .id(1L)
                .user(user)
                .title("Hyderabad Trip")
                .destinationCountry("India")
                .destinationCity("Hyderabad")
                .startDate(LocalDate.now().plusDays(10))
                .endDate(LocalDate.now().plusDays(15))
                .budget(BigDecimal.valueOf(30000))
                .status(TripStatus.PLANNED)
                .build();

        Trip trip2 = Trip.builder()
                .id(2L)
                .user(user)
                .title("Delhi Trip")
                .destinationCountry("India")
                .destinationCity("Delhi")
                .startDate(LocalDate.now().plusDays(20))
                .endDate(LocalDate.now().plusDays(25))
                .budget(BigDecimal.valueOf(35000))
                .status(TripStatus.PLANNED)
                .build();

        Expense food =
                Expense.builder()
                        .id(1L)
                        .trip(trip1)
                        .category(ExpenseCategory.FOOD)
                        .amount(BigDecimal.valueOf(5000))
                        .build();

        Expense hotel =
                Expense.builder()
                        .id(2L)
                        .trip(trip1)
                        .category(ExpenseCategory.HOTEL)
                        .amount(BigDecimal.valueOf(10000))
                        .build();

        Expense transport =
                Expense.builder()
                        .id(3L)
                        .trip(trip2)
                        .category(ExpenseCategory.TRANSPORT)
                        .amount(BigDecimal.valueOf(8000))
                        .build();

        when(userRepository.findByEmail(
                "test@example.com"
        )).thenReturn(Optional.of(user));

        when(tripRepository.findByUser(
                user
        )).thenReturn(
                List.of(trip1, trip2)
        );

        when(expenseRepository.findByTripIn(
                List.of(trip1, trip2)
        )).thenReturn(
                List.of(
                        food,
                        hotel,
                        transport
                )
        );

        when(tripRepository.findTop5ByUserOrderByCreatedAtDesc(
                user
        )).thenReturn(
                List.of(trip1, trip2)
        );

        DashboardResponse response =
                dashboardService.getDashboard(
                        "test@example.com"
                );

        assertNotNull(response);

        assertEquals(
                2,
                response.getTotalTrips()
        );

        assertEquals(
                2,
                response.getUpcomingTrips()
        );

        assertEquals(
                0,
                response.getCompletedTrips()
        );

        assertEquals(
                BigDecimal.valueOf(65000),
                response.getTotalBudget()
        );

        assertEquals(
                BigDecimal.valueOf(23000),
                response.getTotalExpenses()
        );

        assertEquals(
                BigDecimal.valueOf(42000),
                response.getRemainingBudget()
        );

        assertEquals(
                1,
                response.getCountriesVisited()
        );

        assertEquals(
                BigDecimal.valueOf(5000),
                response.getExpenseBreakdown()
                        .get("FOOD")
        );

        assertEquals(
                BigDecimal.valueOf(10000),
                response.getExpenseBreakdown()
                        .get("HOTEL")
        );

        assertEquals(
                BigDecimal.valueOf(8000),
                response.getExpenseBreakdown()
                        .get("TRANSPORT")
        );

        verify(userRepository)
                .findByEmail("test@example.com");

        verify(tripRepository)
                .findByUser(user);

        verify(expenseRepository)
                .findByTripIn(
                        List.of(trip1, trip2)
                );
    }
}