package com.tripwise.backend.service;

import com.tripwise.backend.dto.ExpenseRequest;
import com.tripwise.backend.dto.ExpenseResponse;
import com.tripwise.backend.entity.Expense;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.exception.ExpenseNotFoundException;
import com.tripwise.backend.exception.InvalidTripDateException;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.repository.ExpenseRepository;
import com.tripwise.backend.repository.TripRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private Trip trip;

    @BeforeEach
    void setUp() {
        trip = Trip.builder()
                .id(1L)
                .startDate(LocalDate.of(2026, 10, 10))
                .endDate(LocalDate.of(2026, 10, 16))
                .build();
    }

    @Test
    void shouldCreateExpense() {

        ExpenseRequest request = new ExpenseRequest();

        request.setTitle("Dinner");
        request.setAmount(new BigDecimal("1850.00"));
        request.setDate(LocalDate.of(2026, 10, 12));
        request.setCategory("Food");
        request.setPaymentMethod("UPI");
        request.setNotes("Dinner with friends");

        when(tripRepository.findByIdAndUserEmail(
                1L,
                "user@example.com"
        )).thenReturn(Optional.of(trip));

        Expense savedExpense = Expense.builder()
                .id(10L)
                .trip(trip)
                .title("Dinner")
                .amount(new BigDecimal("1850.00"))
                .date(LocalDate.of(2026, 10, 12))
                .category("Food")
                .paymentMethod("UPI")
                .notes("Dinner with friends")
                .build();

        when(expenseRepository.save(any(Expense.class)))
                .thenReturn(savedExpense);

        ExpenseResponse response =
                expenseService.createExpense(
                        1L,
                        request,
                        "user@example.com"
                );

        assertEquals(10L, response.getId());
        assertEquals("Dinner", response.getTitle());
        assertEquals(
                new BigDecimal("1850.00"),
                response.getAmount()
        );

        verify(expenseRepository)
                .save(any(Expense.class));
    }

    @Test
    void shouldRejectExpenseOutsideTripDates() {

        ExpenseRequest request = new ExpenseRequest();

        request.setTitle("Dinner");
        request.setAmount(new BigDecimal("500"));
        request.setDate(LocalDate.of(2026, 10, 20));
        request.setCategory("Food");

        when(tripRepository.findByIdAndUserEmail(
                1L,
                "user@example.com"
        )).thenReturn(Optional.of(trip));

        assertThrows(
                InvalidTripDateException.class,
                () -> expenseService.createExpense(
                        1L,
                        request,
                        "user@example.com"
                )
        );

        verify(expenseRepository, never())
                .save(any());
    }

    @Test
    void shouldRejectExpenseWhenTripDoesNotBelongToUser() {

        ExpenseRequest request = new ExpenseRequest();

        request.setTitle("Dinner");
        request.setAmount(new BigDecimal("500"));
        request.setDate(LocalDate.of(2026, 10, 12));
        request.setCategory("Food");

        when(tripRepository.findByIdAndUserEmail(
                1L,
                "user@example.com"
        )).thenReturn(Optional.empty());

        assertThrows(
                TripNotFoundException.class,
                () -> expenseService.createExpense(
                        1L,
                        request,
                        "user@example.com"
                )
        );

        verify(expenseRepository, never())
                .save(any());
    }

    @Test
    void shouldReturnExpenses() {

        when(tripRepository.findByIdAndUserEmail(
                1L,
                "user@example.com"
        )).thenReturn(Optional.of(trip));

        Expense expense = Expense.builder()
                .id(10L)
                .trip(trip)
                .title("Dinner")
                .amount(new BigDecimal("1850.00"))
                .date(LocalDate.of(2026, 10, 12))
                .category("Food")
                .build();

        when(expenseRepository.findByTripIdOrderByDateAsc(1L))
                .thenReturn(List.of(expense));

        List<ExpenseResponse> responses =
                expenseService.getExpenses(
                        1L,
                        "user@example.com"
                );

        assertEquals(1, responses.size());
        assertEquals(
                "Dinner",
                responses.get(0).getTitle()
        );
    }

    @Test
    void shouldRejectDeletingMissingExpense() {

        when(tripRepository.findByIdAndUserEmail(
                1L,
                "user@example.com"
        )).thenReturn(Optional.of(trip));

        when(expenseRepository.findByIdAndTripId(
                999L,
                1L
        )).thenReturn(Optional.empty());

        assertThrows(
                ExpenseNotFoundException.class,
                () -> expenseService.deleteExpense(
                        1L,
                        999L,
                        "user@example.com"
                )
        );

        verify(expenseRepository, never())
                .delete(any());
    }
}
