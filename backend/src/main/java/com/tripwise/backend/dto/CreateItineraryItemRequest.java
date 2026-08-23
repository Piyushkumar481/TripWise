package com.tripwise.backend.dto;

import com.tripwise.backend.entity.ItineraryCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateItineraryItemRequest {

    @NotBlank(message = "Activity title is required")
    @Size(
            max = 150,
            message = "Activity title must not exceed 150 characters"
    )
    private String title;

    @NotNull(message = "Activity date is required")
    private LocalDate activityDate;

    private LocalTime startTime;

    private LocalTime endTime;

    @NotNull(message = "Activity category is required")
    private ItineraryCategory category;

    @Size(
            max = 200,
            message = "Location must not exceed 200 characters"
    )
    private String location;

    private String notes;

    private Integer displayOrder;
}