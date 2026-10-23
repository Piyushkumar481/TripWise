package com.tripwise.backend.dto;

import com.tripwise.backend.entity.DocumentCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DocumentRequest {

    @NotBlank(message = "Document title is required")
    @Size(
        max = 150,
        message = "Document title must not exceed 150 characters"
    )
    private String title;

    @Size(
        max = 500,
        message = "Description must not exceed 500 characters"
    )
    private String description;

    @NotNull(message = "Document category is required")
    private DocumentCategory category;
}
