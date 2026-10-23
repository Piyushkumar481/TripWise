package com.tripwise.backend.dto;

import com.tripwise.backend.entity.DocumentCategory;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TripDocumentResponse {

    private Long id;
    private Long tripId;
    private String title;
    private String description;
    private String originalFileName;
    private DocumentCategory category;
    private String contentType;
    private Long fileSize;
    private LocalDateTime uploadedAt;
}
