package com.tripwise.backend.ai.repository;

import com.tripwise.backend.ai.entity.AIItinerary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AIItineraryRepository
        extends JpaRepository<AIItinerary, Long> {

    List<AIItinerary> findByUserEmailOrderByCreatedAtDesc(
            String email
    );

    Optional<AIItinerary> findByIdAndUserEmail(
            Long id,
            String email
    );
}