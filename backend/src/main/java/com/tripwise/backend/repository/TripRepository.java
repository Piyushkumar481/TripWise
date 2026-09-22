package com.tripwise.backend.repository;

import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.TripStatus;
import com.tripwise.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByUserId(Long userId);

    Page<Trip> findByUserId(Long userId, Pageable pageable);

    Optional<Trip> findByIdAndUserId(
            Long id,
            Long userId
    );

    Optional<Trip> findByIdAndUserEmail(
            Long id,
            String email
    );

    Page<Trip> findByUserEmail(
            String email,
            Pageable pageable
    );

    @Query("""
            SELECT t
            FROM Trip t
            WHERE t.user.email = :email
            AND (
                LOWER(t.title) LIKE CONCAT(
                        '%',
                        LOWER(COALESCE(:search, '')),
                        '%'
                )
                OR LOWER(t.destinationCity) LIKE CONCAT(
                        '%',
                        LOWER(COALESCE(:search, '')),
                        '%'
                )
                OR LOWER(t.destinationCountry) LIKE CONCAT(
                        '%',
                        LOWER(COALESCE(:search, '')),
                        '%'
                )
            )
            AND (
                LOWER(t.destinationCity) =
                        LOWER(COALESCE(:destination, ''))
                OR LOWER(t.destinationCountry) =
                        LOWER(COALESCE(:destination, ''))
                OR :destination IS NULL
            )
            AND (
                :startDateFrom IS NULL
                OR t.startDate >= :startDateFrom
            )
            AND (
                :startDateTo IS NULL
                OR t.startDate <= :startDateTo
            )
            """)
    Page<Trip> searchTrips(
            @Param("email") String email,
            @Param("search") String search,
            @Param("destination") String destination,
            @Param("startDateFrom") LocalDate startDateFrom,
            @Param("startDateTo") LocalDate startDateTo,
            Pageable pageable
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


