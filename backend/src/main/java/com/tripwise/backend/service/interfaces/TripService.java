package com.tripwise.backend.service.interfaces;

import com.tripwise.backend.dto.TripRequest;
import com.tripwise.backend.dto.TripResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface TripService {

    TripResponse createTrip(String email, TripRequest request);

    List<TripResponse> getMyTrips(String email);

    Page<TripResponse> getMyTrips(
            String email,
            int page,
            int size,
            String sortBy,
            String direction,
            String search,
            String destination,
            LocalDate startDateFrom,
            LocalDate startDateTo
    );

    TripResponse getTripById(String email, Long tripId);

    TripResponse updateTrip(
            String email,
            Long tripId,
            TripRequest request);

    void deleteTrip(String email, Long tripId);

    TripResponse archiveTrip(
            String email,
            Long tripId);

    List<TripResponse> searchTrips(
            String email,
            String city);
}
