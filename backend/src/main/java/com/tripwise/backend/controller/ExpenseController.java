package com.tripwise.backend.controller;

import com.tripwise.backend.dto.ApiResponse;
import com.tripwise.backend.dto.CreateExpenseRequest;
import com.tripwise.backend.dto.ExpenseResponse;
import com.tripwise.backend.dto.ExpenseSummaryResponse;
import com.tripwise.backend.service.interfaces.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            Authentication authentication,
            @PathVariable Long tripId,
            @Valid @RequestBody CreateExpenseRequest request) {

        ExpenseResponse expense =
                expenseService.createExpense(
                        authentication.getName(),
                        tripId,
                        request
                );

        ApiResponse<ExpenseResponse> response =
                ApiResponse.<ExpenseResponse>builder()
                        .success(true)
                        .message("Expense created successfully.")
                        .data(expense)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getExpenses(
            Authentication authentication,
            @PathVariable Long tripId) {

        List<ExpenseResponse> expenses =
                expenseService.getExpenses(
                        authentication.getName(),
                        tripId
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

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<ExpenseSummaryResponse>> getExpenseSummary(
            Authentication authentication,
            @PathVariable Long tripId) {

        ExpenseSummaryResponse summary =
                expenseService.getExpenseSummary(
                        authentication.getName(),
                        tripId
                );

        ApiResponse<ExpenseSummaryResponse> response =
                ApiResponse.<ExpenseSummaryResponse>builder()
                        .success(true)
                        .message("Expense summary retrieved successfully.")
                        .data(summary)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{expenseId:\\d+}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getExpense(
            Authentication authentication,
            @PathVariable Long tripId,
            @PathVariable Long expenseId) {

        ExpenseResponse expense =
                expenseService.getExpense(
                        authentication.getName(),
                        tripId,
                        expenseId
                );

        ApiResponse<ExpenseResponse> response =
                ApiResponse.<ExpenseResponse>builder()
                        .success(true)
                        .message("Expense retrieved successfully.")
                        .data(expense)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{expenseId:\\d+}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            Authentication authentication,
            @PathVariable Long tripId,
            @PathVariable Long expenseId,
            @Valid @RequestBody CreateExpenseRequest request) {

        ExpenseResponse expense =
                expenseService.updateExpense(
                        authentication.getName(),
                        tripId,
                        expenseId,
                        request
                );

        ApiResponse<ExpenseResponse> response =
                ApiResponse.<ExpenseResponse>builder()
                        .success(true)
                        .message("Expense updated successfully.")
                        .data(expense)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{expenseId:\\d+}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            Authentication authentication,
            @PathVariable Long tripId,
            @PathVariable Long expenseId) {

        expenseService.deleteExpense(
                authentication.getName(),
                tripId,
                expenseId
        );

        ApiResponse<Void> response =
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Expense deleted successfully.")
                        .data(null)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }
}