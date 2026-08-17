package com.tripwise.backend.dto;

import com.tripwise.backend.entity.ExpenseCategory;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class ExpenseResponse {

    private Long id;

    private ExpenseCategory category;

    private BigDecimal amount;

    private LocalDate expenseDate;

    private String description;
}