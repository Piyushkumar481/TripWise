package com.tripwise.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TripNoteRequest {

    @NotBlank(message = "Note title is required")
    @Size(max = 150, message = "Note title must not exceed 150 characters")
    private String title;

    @NotBlank(message = "Note content is required")
    @Size(max = 20000, message = "Note content must not exceed 20000 characters")
    private String content;

    private Boolean pinned;
}