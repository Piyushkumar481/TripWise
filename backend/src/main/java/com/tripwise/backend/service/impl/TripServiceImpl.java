package com.tripwise.backend.service.impl;

import com.tripwise.backend.dto.TripRequest;
import com.tripwise.backend.dto.TripResponse;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.TripStatus;
import com.tripwise.backend.entity.User;
import com.tripwise.backend.exception.InvalidCredentialsException;
import com.tripwise.backend.exception.InvalidTripDateException;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.repository.TripRepository;
import com.tripwise.backend.repository.UserRepository;
import com.tripwise.backend.service.interfaces.TripService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private static final Logger logger =
            LoggerFactory.getLogger(TripServiceImpl.class);

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of(
                    "title",
                    "destination",
                    "startDate",
                    "endDate"
            );

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @Override
    public TripResponse createTrip(
            String email,
            TripRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new InvalidCredentialsException("User not found"));

        validateDates(
                request.getStartDate(),
                request.getEndDate()
        );

        Trip trip = Trip.builder()
                .user(user)
                .title(request.getTitle())
                .destinationCountry(request.getDestinationCountry())
                .destinationCity(request.getDestinationCity())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .budget(request.getBudget())
                .status(TripStatus.PLANNED)
                .createdAt(LocalDateTime.now())
                .build();

        Trip savedTrip = tripRepository.save(trip);

        logger.info(
                "Trip created successfully with id: {}",
                savedTrip.getId()
        );

        return mapToResponse(savedTrip);
    }

    @Override
    public List<TripResponse> getMyTrips(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new InvalidCredentialsException("User not found"));

        return tripRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public Page<TripResponse> getMyTrips(
            String email,
            int page,
            int size,
            String sortBy,
            String direction,
            String search,
            String destination,
            LocalDate startDateFrom,
            LocalDate startDateTo) {

        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new IllegalArgumentException(
                    "Invalid sort field: " + sortBy
            );
        }

        if (!direction.equalsIgnoreCase("asc")
                && !direction.equalsIgnoreCase("desc")) {

            throw new IllegalArgumentException(
                    "Direction must be 'asc' or 'desc'"
            );
        }

        if (startDateFrom != null
                && startDateTo != null
                && startDateFrom.isAfter(startDateTo)) {

            throw new IllegalArgumentException(
                    "startDateFrom cannot be after startDateTo"
            );
        }

        Sort.Direction sortDirection =
                direction.equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(sortDirection, sortBy)
                );

        Page<Trip> trips =
                tripRepository.searchTrips(
                        email,
                        search,
                        destination,
                        startDateFrom,
                        startDateTo,
                        pageable
                );

        return trips.map(this::mapToResponse);
    }

    @Override
    public TripResponse getTripById(
            String email,
            Long tripId) {

        logger.debug("Fetching trip with id: {}", tripId);

        Trip trip = tripRepository
                .findByIdAndUserEmail(tripId, email)
                .orElseThrow(() -> {
                    logger.warn(
                            "Trip with id {} was not found for user {}",
                            tripId,
                            email
                    );

                    return new TripNotFoundException("Trip not found");
                });

        logger.debug(
                "Trip with id {} retrieved successfully",
                tripId
        );

        return mapToResponse(trip);
    }

    @Override
    public TripResponse updateTrip(
            String email,
            Long tripId,
            TripRequest request) {

        Trip trip = tripRepository
                .findByIdAndUserEmail(tripId, email)
                .orElseThrow(() ->
                        new TripNotFoundException("Trip not found"));

        validateDates(
                request.getStartDate(),
                request.getEndDate()
        );

        trip.setTitle(request.getTitle());
        trip.setDestinationCountry(request.getDestinationCountry());
        trip.setDestinationCity(request.getDestinationCity());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setBudget(request.getBudget());

        Trip updatedTrip = tripRepository.save(trip);

        return mapToResponse(updatedTrip);
    }

    @Override
    public void deleteTrip(
            String email,
            Long tripId) {

        logger.debug(
                "Attempting to delete trip with id: {}",
                tripId
        );

        Trip trip = tripRepository
                .findByIdAndUserEmail(tripId, email)
                .orElseThrow(() -> {
                    logger.warn(
                            "Trip with id {} was not found for user {}",
                            tripId,
                            email
                    );

                    return new TripNotFoundException("Trip not found");
                });

        tripRepository.delete(trip);

        logger.info(
                "Trip deleted successfully with id: {}",
                tripId
        );
    }

    @Override
    public TripResponse archiveTrip(
            String email,
            Long tripId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new InvalidCredentialsException("User not found"));

        Trip trip = tripRepository
                .findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() ->
                        new TripNotFoundException("Trip not found"));

        trip.setStatus(TripStatus.ARCHIVED);

        Trip updatedTrip = tripRepository.save(trip);

        return mapToResponse(updatedTrip);
    }

    @Override
    public List<TripResponse> searchTrips(
            String email,
            String city) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new InvalidCredentialsException("User not found"));

        return tripRepository
                .findByUserAndDestinationCityContainingIgnoreCase(
                        user,
                        city
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private void validateDates(
            LocalDate startDate,
            LocalDate endDate) {

        if (endDate.isBefore(startDate)) {
            throw new InvalidTripDateException(
                    "End date cannot be before start date");
        }
    }

    private TripResponse mapToResponse(Trip trip) {

        return TripResponse.builder()
                .id(trip.getId())
                .title(trip.getTitle())
                .destinationCountry(trip.getDestinationCountry())
                .destinationCity(trip.getDestinationCity())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .budget(trip.getBudget())
                .status(trip.getStatus())
                .build();
    }
}

