package com.tripwise.backend.controller;

import com.tripwise.backend.dto.ApiResponse;
import com.tripwise.backend.dto.TripRequest;
import com.tripwise.backend.dto.TripResponse;
import com.tripwise.backend.service.interfaces.TripService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<ApiResponse<TripResponse>> createTrip(
            Authentication authentication,
            @Valid @RequestBody TripRequest request) {

        TripResponse response =
                tripService.createTrip(
                        authentication.getName(),
                        request
                );

        ApiResponse<TripResponse> apiResponse =
                ApiResponse.<TripResponse>builder()
                        .success(true)
                        .message("Trip created successfully.")
                        .data(response)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TripResponse>>> getMyTrips(
            Authentication authentication) {

        List<TripResponse> response =
                tripService.getMyTrips(
                        authentication.getName()
                );

        ApiResponse<List<TripResponse>> apiResponse =
                ApiResponse.<List<TripResponse>>builder()
                        .success(true)
                        .message("Trips retrieved successfully.")
                        .data(response)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TripResponse>> getTripById(
            Authentication authentication,
            @PathVariable Long id) {

        TripResponse response =
                tripService.getTripById(
                        authentication.getName(),
                        id
                );

        ApiResponse<TripResponse> apiResponse =
                ApiResponse.<TripResponse>builder()
                        .success(true)
                        .message("Trip retrieved successfully.")
                        .data(response)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TripResponse>> updateTrip(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody TripRequest request) {

        TripResponse response =
                tripService.updateTrip(
                        authentication.getName(),
                        id,
                        request
                );

        ApiResponse<TripResponse> apiResponse =
                ApiResponse.<TripResponse>builder()
                        .success(true)
                        .message("Trip updated successfully.")
                        .data(response)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTrip(
            Authentication authentication,
            @PathVariable Long id) {

        tripService.deleteTrip(
                authentication.getName(),
                id
        );

        ApiResponse<Void> apiResponse =
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Trip deleted successfully.")
                        .data(null)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(apiResponse);
    }
}