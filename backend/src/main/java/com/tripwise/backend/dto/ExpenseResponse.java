package com.tripwise.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class ExpenseResponse {

    private Long id;

    private Long tripId;

    private String title;

    private BigDecimal amount;

    private LocalDate date;

    private String category;

    private String paymentMethod;

    private String notes;
}
