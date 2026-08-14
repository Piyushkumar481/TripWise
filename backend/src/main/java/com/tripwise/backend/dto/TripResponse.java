package com.tripwise.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class TripResponse {

    private Long id;

    private String title;

    private String destinationCountry;

    private String destinationCity;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal budget;

    private String status;
}