package com.tripwise.backend.dto;

import com.tripwise.backend.entity.PackingCategory;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PackingItemResponse {

    private Long id;
    private Long tripId;
    private String name;
    private String description;
    private PackingCategory category;
    private Integer quantity;
    private Boolean packed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
