package com.tripwise.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class RecentTripResponse {

    private Long id;

    private String title;

    private String destinationCountry;

    private String destinationCity;

    private LocalDate startDate;

    private LocalDate endDate;

    private String status;

    private java.math.BigDecimal budget;
}