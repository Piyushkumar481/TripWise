package com.tripwise.backend.controller;

import com.tripwise.backend.dto.ApiResponse;
import com.tripwise.backend.dto.ExpenseRequest;
import com.tripwise.backend.dto.ExpenseResponse;
import com.tripwise.backend.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getExpenses(
            @PathVariable Long tripId,
            Authentication authentication) {

        List<ExpenseResponse> expenses =
                expenseService.getExpenses(
                        tripId,
                        authentication.getName()
                );

        ApiResponse<List<ExpenseResponse>> response =
                ApiResponse.<List<ExpenseResponse>>builder()
                        .success(true)
                        .message("Expenses retrieved successfully.")
                        .data(expenses)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            @PathVariable Long tripId,
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication) {

        ExpenseResponse created =
                expenseService.createExpense(
                        tripId,
                        request,
                        authentication.getName()
                );

        ApiResponse<ExpenseResponse> response =
                ApiResponse.<ExpenseResponse>builder()
                        .success(true)
                        .message("Expense created successfully.")
                        .data(created)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @PathVariable Long tripId,
            @PathVariable Long expenseId,
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication) {

        ExpenseResponse updated =
                expenseService.updateExpense(
                        tripId,
                        expenseId,
                        request,
                        authentication.getName()
                );

        ApiResponse<ExpenseResponse> response =
                ApiResponse.<ExpenseResponse>builder()
                        .success(true)
                        .message("Expense updated successfully.")
                        .data(updated)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long tripId,
            @PathVariable Long expenseId,
            Authentication authentication) {

        expenseService.deleteExpense(
                tripId,
                expenseId,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }
}
