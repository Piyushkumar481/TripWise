package com.tripwise.backend.service.interfaces;

import com.tripwise.backend.dto.CreateExpenseRequest;
import com.tripwise.backend.dto.ExpenseResponse;
import com.tripwise.backend.dto.ExpenseSummaryResponse;

import java.util.List;

public interface ExpenseService {

    ExpenseResponse createExpense(
            String email,
            Long tripId,
            CreateExpenseRequest request
    );

    List<ExpenseResponse> getExpenses(
            String email,
            Long tripId
    );

    ExpenseResponse getExpense(
            String email,
            Long tripId,
            Long expenseId
    );

    ExpenseResponse updateExpense(
            String email,
            Long tripId,
            Long expenseId,
            CreateExpenseRequest request
    );

    void deleteExpense(
            String email,
            Long tripId,
            Long expenseId
    );

    ExpenseSummaryResponse getExpenseSummary(
            String email,
            Long tripId
    );
}