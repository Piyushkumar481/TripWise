package com.tripwise.backend.dto;

import com.tripwise.backend.entity.ExpenseCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateExpenseRequest {

    @NotNull(message = "Expense category is required")
    private ExpenseCategory category;

    @NotNull(message = "Expense amount is required")
    @DecimalMin(
            value = "0.01",
            message = "Expense amount must be greater than zero"
    )
    private BigDecimal amount;

    @NotNull(message = "Expense date is required")
    private LocalDate expenseDate;

    @Size(
            max = 500,
            message = "Description must not exceed 500 characters"
    )
    private String description;
}