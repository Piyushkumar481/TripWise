package com.tripwise.backend.repository;

import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByUserId(Long userId);

    Optional<Trip> findByIdAndUserId(Long id, Long userId);

    List<Trip> findByUserAndDestinationCityContainingIgnoreCase(
            User user,
            String city);
}