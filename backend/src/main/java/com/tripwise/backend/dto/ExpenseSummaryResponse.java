package com.tripwise.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
public class ExpenseSummaryResponse {

    private BigDecimal totalExpenses;

    private BigDecimal tripBudget;

    private BigDecimal remainingBudget;

    private Map<String, BigDecimal> categoryTotals;
}