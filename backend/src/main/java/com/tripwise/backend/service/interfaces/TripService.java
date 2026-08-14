package com.tripwise.backend.service.interfaces;

import com.tripwise.backend.dto.TripRequest;
import com.tripwise.backend.dto.TripResponse;

import java.util.List;

public interface TripService {

    TripResponse createTrip(String email, TripRequest request);

    List<TripResponse> getMyTrips(String email);

    TripResponse getTripById(String email, Long tripId);

    TripResponse updateTrip(
            String email,
            Long tripId,
            TripRequest request);

    void deleteTrip(String email, Long tripId);
}