package com.tripwise.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class ItineraryResponse {

    private Long id;

    private Long tripId;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private String title;

    private String description;

    private String location;

    private String category;
}
