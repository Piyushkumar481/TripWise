package com.tripwise.backend.repository;

import com.tripwise.backend.entity.Document;
import com.tripwise.backend.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository
        extends JpaRepository<Document, Long> {

    List<Document> findByTrip(Trip trip);

    Optional<Document> findByIdAndTrip(
            Long id,
            Trip trip
    );
}