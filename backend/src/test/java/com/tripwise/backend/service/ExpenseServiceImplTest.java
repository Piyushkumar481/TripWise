package com.tripwise.backend.service;

import com.tripwise.backend.dto.CreateExpenseRequest;
import com.tripwise.backend.dto.ExpenseResponse;
import com.tripwise.backend.entity.Expense;
import com.tripwise.backend.entity.ExpenseCategory;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.User;
import com.tripwise.backend.repository.ExpenseRepository;
import com.tripwise.backend.repository.TripRepository;
import com.tripwise.backend.repository.UserRepository;
import com.tripwise.backend.service.impl.ExpenseServiceImpl;

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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ExpenseServiceImplTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private TripRepository tripRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ExpenseServiceImpl expenseService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldCreateExpenseSuccessfully() {

        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        Trip trip = Trip.builder()
                .id(1L)
                .user(user)
                .title("Hyderabad Trip")
                .build();

        CreateExpenseRequest request =
                new CreateExpenseRequest();

        request.setCategory(
                ExpenseCategory.FOOD
        );

        request.setAmount(
                BigDecimal.valueOf(500)
        );

        request.setExpenseDate(
                LocalDate.now()
        );

        request.setDescription(
                "Dinner"
        );

        when(userRepository.findByEmail(
                "test@example.com"
        )).thenReturn(Optional.of(user));

        when(tripRepository.findByIdAndUserId(
                1L,
                user.getId()
        )).thenReturn(Optional.of(trip));

        Expense savedExpense =
                Expense.builder()
                        .id(1L)
                        .trip(trip)
                        .category(ExpenseCategory.FOOD)
                        .amount(BigDecimal.valueOf(500))
                        .expenseDate(
                                request.getExpenseDate()
                        )
                        .description("Dinner")
                        .build();

        when(expenseRepository.save(
                any(Expense.class)
        )).thenReturn(savedExpense);

        ExpenseResponse response =
                expenseService.createExpense(
                        "test@example.com",
                        1L,
                        request
                );

        assertNotNull(response);

        assertEquals(
                ExpenseCategory.FOOD,
                response.getCategory()
        );

        assertEquals(
                BigDecimal.valueOf(500),
                response.getAmount()
        );

        verify(expenseRepository)
                .save(any(Expense.class));
    }

    @Test
    void shouldCalculateExpenseSummaryCorrectly() {

        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        Trip trip = Trip.builder()
                .id(1L)
                .user(user)
                .title("Hyderabad Trip")
                .budget(BigDecimal.valueOf(5000))
                .build();

        Expense food1 =
                Expense.builder()
                        .id(1L)
                        .trip(trip)
                        .category(ExpenseCategory.FOOD)
                        .amount(BigDecimal.valueOf(500))
                        .expenseDate(LocalDate.now())
                        .description("Dinner")
                        .build();

        Expense hotel =
                Expense.builder()
                        .id(2L)
                        .trip(trip)
                        .category(ExpenseCategory.HOTEL)
                        .amount(BigDecimal.valueOf(1000))
                        .expenseDate(LocalDate.now())
                        .description("Hotel")
                        .build();

        Expense food2 =
                Expense.builder()
                        .id(3L)
                        .trip(trip)
                        .category(ExpenseCategory.FOOD)
                        .amount(BigDecimal.valueOf(300))
                        .expenseDate(LocalDate.now())
                        .description("Lunch")
                        .build();

        when(userRepository.findByEmail(
                "test@example.com"
        )).thenReturn(Optional.of(user));

        when(tripRepository.findByIdAndUserId(
                1L,
                user.getId()
        )).thenReturn(Optional.of(trip));

        when(expenseRepository.findByTrip(
                trip
        )).thenReturn(
                List.of(
                        food1,
                        hotel,
                        food2
                )
        );

        var response =
                expenseService.getExpenseSummary(
                        "test@example.com",
                        1L
                );

        assertNotNull(response);

        assertEquals(
                BigDecimal.valueOf(1800),
                response.getTotalExpenses()
        );

        assertEquals(
                BigDecimal.valueOf(800),
                response.getCategoryTotals()
                        .get("FOOD")
        );

        assertEquals(
                BigDecimal.valueOf(1000),
                response.getCategoryTotals()
                        .get("HOTEL")
        );
    }
}