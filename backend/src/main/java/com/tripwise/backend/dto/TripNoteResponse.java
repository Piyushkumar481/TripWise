package com.tripwise.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TripNoteResponse {

    private Long id;
    private Long tripId;
    private String title;
    private String content;
    private boolean pinned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}