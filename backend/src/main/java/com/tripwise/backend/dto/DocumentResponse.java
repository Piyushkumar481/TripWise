package com.tripwise.backend.dto;

import com.tripwise.backend.entity.DocumentType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DocumentResponse {

    private Long id;

    private String fileName;

    private String contentType;

    private Long fileSize;

    private DocumentType documentType;

    private String fileUrl;

    private LocalDateTime createdAt;
}