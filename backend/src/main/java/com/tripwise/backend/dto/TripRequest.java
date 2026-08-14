package com.tripwise.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TripRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @Size(max = 100, message = "Destination country must not exceed 100 characters")
    private String destinationCountry;

    @Size(max = 100, message = "Destination city must not exceed 100 characters")
    private String destinationCity;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @DecimalMin(value = "0.0", inclusive = true, message = "Budget must be greater than or equal to 0")
    private BigDecimal budget;
}