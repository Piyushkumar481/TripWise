package com.tripwise.backend.service.impl;

import com.tripwise.backend.dto.TripRequest;
import com.tripwise.backend.dto.TripResponse;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.User;
import com.tripwise.backend.exception.InvalidCredentialsException;
import com.tripwise.backend.repository.TripRepository;
import com.tripwise.backend.repository.UserRepository;
import com.tripwise.backend.service.interfaces.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

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
                .status("PLANNED")
                .createdAt(LocalDateTime.now())
                .build();

        Trip savedTrip = tripRepository.save(trip);

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
    public TripResponse getTripById(
            String email,
            Long tripId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new InvalidCredentialsException("User not found"));

        Trip trip = tripRepository
                .findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Trip not found"));

        return mapToResponse(trip);
    }

    @Override
    public TripResponse updateTrip(
            String email,
            Long tripId,
            TripRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new InvalidCredentialsException("User not found"));

        Trip trip = tripRepository
                .findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Trip not found"));

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

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new InvalidCredentialsException("User not found"));

        Trip trip = tripRepository
                .findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Trip not found"));

        tripRepository.delete(trip);
    }

    private void validateDates(
            LocalDate startDate,
            LocalDate endDate) {

        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException(
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