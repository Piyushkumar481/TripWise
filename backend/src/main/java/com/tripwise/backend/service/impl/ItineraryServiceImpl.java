package com.tripwise.backend.service.impl;

import com.tripwise.backend.dto.CreateItineraryItemRequest;
import com.tripwise.backend.dto.ItineraryItemResponse;
import com.tripwise.backend.entity.ItineraryItem;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.User;
import com.tripwise.backend.exception.InvalidCredentialsException;
import com.tripwise.backend.exception.InvalidItineraryException;
import com.tripwise.backend.exception.ItineraryItemNotFoundException;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.repository.ItineraryItemRepository;
import com.tripwise.backend.repository.TripRepository;
import com.tripwise.backend.repository.UserRepository;
import com.tripwise.backend.service.interfaces.ItineraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItineraryServiceImpl
        implements ItineraryService {

    private final ItineraryItemRepository itineraryRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @Override
    public ItineraryItemResponse createItem(
            String email,
            Long tripId,
            CreateItineraryItemRequest request) {

        Trip trip = getUserTrip(email, tripId);

        validateItemDate(
                trip,
                request.getActivityDate()
        );

        validateTimes(
                request.getStartTime(),
                request.getEndTime()
        );

        ItineraryItem item = ItineraryItem.builder()
                .trip(trip)
                .title(request.getTitle())
                .activityDate(request.getActivityDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .category(request.getCategory())
                .location(request.getLocation())
                .notes(request.getNotes())
                .displayOrder(
                        request.getDisplayOrder() != null
                                ? request.getDisplayOrder()
                                : 0
                )
                .build();

        ItineraryItem saved =
                itineraryRepository.save(item);

        return mapToResponse(saved);
    }

    @Override
    public List<ItineraryItemResponse> getItems(
            String email,
            Long tripId) {

        Trip trip = getUserTrip(email, tripId);

        return itineraryRepository
                .findByTripOrderByActivityDateAscStartTimeAscDisplayOrderAsc(
                        trip
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ItineraryItemResponse getItem(
            String email,
            Long tripId,
            Long itemId) {

        Trip trip = getUserTrip(email, tripId);

        ItineraryItem item =
                itineraryRepository
                        .findByIdAndTrip(itemId, trip)
                        .orElseThrow(() ->
                                new ItineraryItemNotFoundException(
                                        "Itinerary item not found"
                                ));

        return mapToResponse(item);
    }

    @Override
    public ItineraryItemResponse updateItem(
            String email,
            Long tripId,
            Long itemId,
            CreateItineraryItemRequest request) {

        Trip trip = getUserTrip(email, tripId);

        validateItemDate(
                trip,
                request.getActivityDate()
        );

        validateTimes(
                request.getStartTime(),
                request.getEndTime()
        );

        ItineraryItem item =
                itineraryRepository
                        .findByIdAndTrip(itemId, trip)
                        .orElseThrow(() ->
                                new ItineraryItemNotFoundException(
                                        "Itinerary item not found"
                                ));

        item.setTitle(request.getTitle());
        item.setActivityDate(request.getActivityDate());
        item.setStartTime(request.getStartTime());
        item.setEndTime(request.getEndTime());
        item.setCategory(request.getCategory());
        item.setLocation(request.getLocation());
        item.setNotes(request.getNotes());
        item.setDisplayOrder(
                request.getDisplayOrder() != null
                        ? request.getDisplayOrder()
                        : 0
        );

        ItineraryItem updated =
                itineraryRepository.save(item);

        return mapToResponse(updated);
    }

    @Override
    public void deleteItem(
            String email,
            Long tripId,
            Long itemId) {

        Trip trip = getUserTrip(email, tripId);

        ItineraryItem item =
                itineraryRepository
                        .findByIdAndTrip(itemId, trip)
                        .orElseThrow(() ->
                                new ItineraryItemNotFoundException(
                                        "Itinerary item not found"
                                ));

        itineraryRepository.delete(item);
    }

    private Trip getUserTrip(
            String email,
            Long tripId) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new InvalidCredentialsException(
                                        "User not found"
                                ));

        return tripRepository
                .findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() ->
                        new TripNotFoundException(
                                "Trip not found"
                        ));
    }

    private void validateItemDate(
            Trip trip,
            LocalDate activityDate) {

        if (activityDate.isBefore(trip.getStartDate()) ||
                activityDate.isAfter(trip.getEndDate())) {

            throw new InvalidItineraryException(
                    "Activity date must be within the trip dates"
            );
        }
    }

    private void validateTimes(
            LocalTime startTime,
            LocalTime endTime) {

        if (startTime != null &&
                endTime != null &&
                endTime.isBefore(startTime)) {

            throw new InvalidItineraryException(
                    "End time cannot be before start time"
            );
        }
    }

    private ItineraryItemResponse mapToResponse(
            ItineraryItem item) {

        return ItineraryItemResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .activityDate(item.getActivityDate())
                .startTime(item.getStartTime())
                .endTime(item.getEndTime())
                .category(item.getCategory())
                .location(item.getLocation())
                .notes(item.getNotes())
                .displayOrder(item.getDisplayOrder())
                .build();
    }
}