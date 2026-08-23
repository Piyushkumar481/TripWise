package com.tripwise.backend.repository;

import com.tripwise.backend.entity.ItineraryItem;
import com.tripwise.backend.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItineraryItemRepository
        extends JpaRepository<ItineraryItem, Long> {

    List<ItineraryItem> findByTripOrderByActivityDateAscStartTimeAscDisplayOrderAsc(
            Trip trip
    );

    Optional<ItineraryItem> findByIdAndTrip(
            Long id,
            Trip trip
    );
}