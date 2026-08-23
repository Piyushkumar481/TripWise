package com.tripwise.backend.service.interfaces;

import com.tripwise.backend.dto.DocumentResponse;
import com.tripwise.backend.entity.DocumentType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {

    DocumentResponse uploadDocument(
            String email,
            Long tripId,
            MultipartFile file,
            DocumentType documentType
    );

    List<DocumentResponse> getDocuments(
            String email,
            Long tripId
    );

    DocumentResponse getDocument(
            String email,
            Long tripId,
            Long documentId
    );

    void deleteDocument(
            String email,
            Long tripId,
            Long documentId
    );
}