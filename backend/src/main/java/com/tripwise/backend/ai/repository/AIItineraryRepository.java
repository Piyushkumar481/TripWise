package com.tripwise.backend.ai.repository;

import com.tripwise.backend.ai.entity.AIItinerary;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AIItineraryRepository
        extends JpaRepository<AIItinerary, Long> {

    Page<AIItinerary> findByUserEmailOrderByCreatedAtDesc(
            String email,
            Pageable pageable
    );

    Optional<AIItinerary> findByIdAndUserEmail(
            Long id,
            String email
    );
}