package com.tripwise.backend.repository;

import com.tripwise.backend.entity.PackingItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PackingItemRepository
        extends JpaRepository<PackingItem, Long> {

    List<PackingItem> findByTripIdOrderByCreatedAtDesc(Long tripId);

    Optional<PackingItem> findByIdAndTripId(
        Long id,
        Long tripId
    );

    List<PackingItem> findByTripIdAndPackedOrderByCreatedAtDesc(
        Long tripId,
        boolean packed
    );

    long countByTripId(Long tripId);

    long countByTripIdAndPacked(Long tripId, boolean packed);
}