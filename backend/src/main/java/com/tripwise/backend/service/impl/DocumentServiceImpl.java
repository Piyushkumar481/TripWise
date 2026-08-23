package com.tripwise.backend.service.impl;

import com.tripwise.backend.dto.DocumentResponse;
import com.tripwise.backend.entity.Document;
import com.tripwise.backend.entity.DocumentType;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.User;
import com.tripwise.backend.exception.DocumentNotFoundException;
import com.tripwise.backend.exception.InvalidCredentialsException;
import com.tripwise.backend.exception.InvalidFileException;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.repository.DocumentRepository;
import com.tripwise.backend.repository.TripRepository;
import com.tripwise.backend.repository.UserRepository;
import com.tripwise.backend.service.interfaces.DocumentService;
import com.tripwise.backend.service.interfaces.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private static final long MAX_FILE_SIZE =
            10 * 1024 * 1024;

    private static final List<String> ALLOWED_TYPES =
            List.of(
                    "application/pdf",
                    "image/jpeg",
                    "image/png"
            );

    private final DocumentRepository documentRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @Override
    public DocumentResponse uploadDocument(
            String email,
            Long tripId,
            MultipartFile file,
            DocumentType documentType) {

        Trip trip = getUserTrip(email, tripId);

        validateFile(file);

        String storedFileName =
                storageService.store(file);

        String fileUrl =
                "/uploads/" + storedFileName;

        Document document = Document.builder()
                .trip(trip)
                .fileName(file.getOriginalFilename())
                .storedFileName(storedFileName)
                .fileUrl(fileUrl)
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .documentType(documentType)
                .createdAt(LocalDateTime.now())
                .build();

        Document savedDocument =
                documentRepository.save(document);

        return mapToResponse(savedDocument);
    }

    @Override
    public List<DocumentResponse> getDocuments(
            String email,
            Long tripId) {

        Trip trip = getUserTrip(email, tripId);

        return documentRepository
                .findByTrip(trip)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public DocumentResponse getDocument(
            String email,
            Long tripId,
            Long documentId) {

        Trip trip = getUserTrip(email, tripId);

        Document document =
                documentRepository
                        .findByIdAndTrip(
                                documentId,
                                trip
                        )
                        .orElseThrow(() ->
                                new DocumentNotFoundException(
                                        "Document not found"
                                ));

        return mapToResponse(document);
    }

    @Override
    public void deleteDocument(
            String email,
            Long tripId,
            Long documentId) {

        Trip trip = getUserTrip(email, tripId);

        Document document =
                documentRepository
                        .findByIdAndTrip(
                                documentId,
                                trip
                        )
                        .orElseThrow(() ->
                                new DocumentNotFoundException(
                                        "Document not found"
                                ));

        storageService.delete(
                document.getStoredFileName()
        );

        documentRepository.delete(document);
    }

    private Trip getUserTrip(
            String email,
            Long tripId) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new InvalidCredentialsException(
                                        "User not found"
                                ));

        return tripRepository
                .findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() ->
                        new TripNotFoundException(
                                "Trip not found"
                        ));
    }

    private void validateFile(
            MultipartFile file) {

        if (file == null ||
                file.isEmpty()) {

            throw new InvalidFileException(
                    "File cannot be empty"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {

            throw new InvalidFileException(
                    "File size cannot exceed 10 MB"
            );
        }

        String contentType =
                file.getContentType();

        if (contentType == null ||
                !ALLOWED_TYPES.contains(contentType)) {

            throw new InvalidFileException(
                    "Only PDF, JPEG and PNG files are allowed"
            );
        }
    }

    private DocumentResponse mapToResponse(
            Document document) {

        return DocumentResponse.builder()
                .id(document.getId())
                .fileName(document.getFileName())
                .contentType(document.getContentType())
                .fileSize(document.getFileSize())
                .documentType(document.getDocumentType())
                .fileUrl(document.getFileUrl())
                .createdAt(document.getCreatedAt())
                .build();
    }
}