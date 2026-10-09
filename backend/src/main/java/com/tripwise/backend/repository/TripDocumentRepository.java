package com.tripwise.backend.repository;

import com.tripwise.backend.entity.TripDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TripDocumentRepository extends JpaRepository<TripDocument, Long> {

    List<TripDocument> findByTripIdOrderByUploadedAtDesc(Long tripId);

    Optional<TripDocument> findByIdAndTripId(Long id, Long tripId);

    boolean existsByStorageKey(String storageKey);
}
