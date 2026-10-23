package com.tripwise.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripwise.backend.dto.ExpenseRequest;
import com.tripwise.backend.dto.ExpenseResponse;
import com.tripwise.backend.exception.ExpenseNotFoundException;
import com.tripwise.backend.exception.GlobalExceptionHandler;
import com.tripwise.backend.exception.InvalidTripDateException;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.service.ExpenseService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ExpenseController.class)
@Import(GlobalExceptionHandler.class)
class ExpenseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @MockitoBean
    private ExpenseService expenseService;

    @MockitoBean
    private com.tripwise.backend.security.JwtService jwtService;

    @MockitoBean
    private com.tripwise.backend.security.CustomUserDetailsService customUserDetailsService;


    @Test
    @WithMockUser(username = "user@example.com")
    void shouldGetExpenses() throws Exception {

        ExpenseResponse response =
                ExpenseResponse.builder()
                        .id(1L)
                        .tripId(1L)
                        .title("Dinner")
                        .amount(new BigDecimal("1850.00"))
                        .date(LocalDate.of(2026, 10, 12))
                        .category("Food")
                        .paymentMethod("UPI")
                        .notes("Dinner with friends")
                        .build();

        when(expenseService.getExpenses(
                1L,
                "user@example.com"
        )).thenReturn(List.of(response));

        mockMvc.perform(
                get("/api/trips/1/expenses")
        )
        .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldCreateExpense() throws Exception {

        ExpenseRequest request = new ExpenseRequest();

        request.setTitle("Dinner");
        request.setAmount(new BigDecimal("1850.00"));
        request.setDate(LocalDate.of(2026, 10, 12));
        request.setCategory("Food");
        request.setPaymentMethod("UPI");
        request.setNotes("Dinner with friends");

        ExpenseResponse response =
                ExpenseResponse.builder()
                        .id(1L)
                        .tripId(1L)
                        .title("Dinner")
                        .amount(new BigDecimal("1850.00"))
                        .date(LocalDate.of(2026, 10, 12))
                        .category("Food")
                        .build();

        when(expenseService.createExpense(
                eq(1L),
                any(ExpenseRequest.class),
                eq("user@example.com")
        )).thenReturn(response);

        mockMvc.perform(
                post("/api/trips/1/expenses")
                        .with(
                                org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf()
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(request)
                        )
        )
        .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldUpdateExpense() throws Exception {

        ExpenseRequest request = new ExpenseRequest();

        request.setTitle("Dinner Updated");
        request.setAmount(new BigDecimal("2100.00"));
        request.setDate(LocalDate.of(2026, 10, 12));
        request.setCategory("Food");
        request.setPaymentMethod("UPI");
        request.setNotes("Updated expense");

        ExpenseResponse response =
                ExpenseResponse.builder()
                        .id(5L)
                        .tripId(1L)
                        .title("Dinner Updated")
                        .amount(new BigDecimal("2100.00"))
                        .date(LocalDate.of(2026, 10, 12))
                        .category("Food")
                        .build();

        when(expenseService.updateExpense(
                eq(1L),
                eq(5L),
                any(ExpenseRequest.class),
                eq("user@example.com")
        )).thenReturn(response);

        mockMvc.perform(
                put("/api/trips/1/expenses/5")
                        .with(
                                org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf()
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(request)
                        )
        )
        .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldDeleteExpense() throws Exception {

        doNothing().when(expenseService).deleteExpense(
                1L,
                5L,
                "user@example.com"
        );

        mockMvc.perform(
                delete("/api/trips/1/expenses/5")
                        .with(
                                org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf()
                        )
        )
        .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldRejectInvalidExpense() throws Exception {

        ExpenseRequest request = new ExpenseRequest();

        request.setTitle("");
        request.setAmount(BigDecimal.ZERO);
        request.setDate(null);
        request.setCategory("");

        mockMvc.perform(
                post("/api/trips/1/expenses")
                        .with(
                                org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf()
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(request)
                        )
        )
        .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldReturn404WhenTripDoesNotExist() throws Exception {

        when(expenseService.getExpenses(
                999L,
                "user@example.com"
        )).thenThrow(
                new TripNotFoundException("Trip not found")
        );

        mockMvc.perform(
                get("/api/trips/999/expenses")
        )
        .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldReturn400WhenExpenseDateIsInvalid() throws Exception {

        ExpenseRequest request = new ExpenseRequest();

        request.setTitle("Dinner");
        request.setAmount(new BigDecimal("500"));
        request.setDate(LocalDate.of(2026, 10, 20));
        request.setCategory("Food");

        when(expenseService.createExpense(
                eq(1L),
                any(ExpenseRequest.class),
                eq("user@example.com")
        )).thenThrow(
                new InvalidTripDateException(
                        "Expense date must be within the trip dates"
                )
        );

        mockMvc.perform(
                post("/api/trips/1/expenses")
                        .with(
                                org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf()
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(request)
                        )
        )
        .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldReturn404WhenExpenseDoesNotExist() throws Exception {

        when(expenseService.getExpenses(
                1L,
                "user@example.com"
        )).thenThrow(
                new ExpenseNotFoundException("Expense not found")
        );

        mockMvc.perform(
                get("/api/trips/1/expenses")
        )
        .andExpect(status().isNotFound());
    }
}






