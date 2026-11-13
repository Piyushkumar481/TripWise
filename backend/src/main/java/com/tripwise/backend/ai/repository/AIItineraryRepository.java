package com.tripwise.backend.ai.repository;

import com.tripwise.backend.ai.entity.AIItinerary;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select itinerary
            from AIItinerary itinerary
            where itinerary.id = :id
              and itinerary.user.email = :email
            """)
    Optional<AIItinerary> findForUpdateByIdAndUserEmail(
            @Param("id") Long id,
            @Param("email") String email
    );
}