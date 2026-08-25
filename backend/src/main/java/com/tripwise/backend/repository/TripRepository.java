package com.tripwise.backend.repository;

import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.TripStatus;
import com.tripwise.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByUserId(Long userId);

    Optional<Trip> findByIdAndUserId(
            Long id,
            Long userId
    );

    List<Trip> findByUserAndDestinationCityContainingIgnoreCase(
            User user,
            String city
    );

    // Dashboard queries

    List<Trip> findByUser(User user);

    Optional<Trip> findByIdAndUser(
            Long id,
            User user
    );

    long countByUser(User user);

    long countByUserAndStartDateAfter(
            User user,
            LocalDate date
    );

    long countByUserAndStatus(
            User user,
            TripStatus status
    );

    List<Trip> findTop5ByUserOrderByCreatedAtDesc(
            User user
    );
}