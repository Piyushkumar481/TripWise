package com.tripwise.backend.dto;

import com.tripwise.backend.entity.ItineraryCategory;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class ItineraryItemResponse {

    private Long id;

    private String title;

    private LocalDate activityDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private ItineraryCategory category;

    private String location;

    private String notes;

    private Integer displayOrder;
}