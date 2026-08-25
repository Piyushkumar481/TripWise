package com.tripwise.backend.repository;

import com.tripwise.backend.entity.Expense;
import com.tripwise.backend.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByTrip(Trip trip);

    Optional<Expense> findByIdAndTrip(
            Long id,
            Trip trip
    );

    List<Expense> findByTripIn(
            List<Trip> trips
    );
}