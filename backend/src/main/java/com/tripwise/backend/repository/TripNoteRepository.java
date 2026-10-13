package com.tripwise.backend.repository;

import com.tripwise.backend.entity.TripNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TripNoteRepository extends JpaRepository<TripNote, Long> {

    List<TripNote> findByTripIdOrderByPinnedDescUpdatedAtDesc(Long tripId);

    Optional<TripNote> findByIdAndTripId(Long id, Long tripId);

    long countByTripId(Long tripId);

    long countByTripIdAndPinned(Long tripId, boolean pinned);
}