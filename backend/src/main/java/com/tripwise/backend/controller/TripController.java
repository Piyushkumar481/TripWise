package com.tripwise.backend.controller;

import com.tripwise.backend.dto.ApiResponse;
import com.tripwise.backend.dto.TripRequest;
import com.tripwise.backend.dto.TripResponse;
import com.tripwise.backend.service.interfaces.TripService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

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
@Tag(
        name = "Trips",
        description = "Trip management APIs"
)
public class TripController {

    private final TripService tripService;

    @Operation(
            summary = "Create a trip",
            description = "Creates a new trip for the authenticated user."
    )
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

    @Operation(
            summary = "Get my trips",
            description = "Returns all trips belonging to the authenticated user."
    )
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

    @Operation(
            summary = "Search trips",
            description = "Searches the authenticated user's trips by destination city."
    )
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<TripResponse>>> searchTrips(
            Authentication authentication,
            @RequestParam String city) {

        List<TripResponse> trips =
                tripService.searchTrips(
                        authentication.getName(),
                        city
                );

        ApiResponse<List<TripResponse>> response =
                ApiResponse.<List<TripResponse>>builder()
                        .success(true)
                        .message("Trips searched successfully.")
                        .data(trips)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get a trip",
            description = "Returns a specific trip owned by the authenticated user."
    )
    @GetMapping("/{id:\\d+}")
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

    @Operation(
            summary = "Update a trip",
            description = "Updates a trip owned by the authenticated user."
    )
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

    @Operation(
            summary = "Delete a trip",
            description = "Deletes a trip owned by the authenticated user."
    )
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

    @Operation(
            summary = "Archive a trip",
            description = "Archives a trip owned by the authenticated user."
    )
    @PatchMapping("/{id}/archive")
    public ResponseEntity<ApiResponse<TripResponse>> archiveTrip(
            Authentication authentication,
            @PathVariable Long id) {

        TripResponse response =
                tripService.archiveTrip(
                        authentication.getName(),
                        id
                );

        ApiResponse<TripResponse> apiResponse =
                ApiResponse.<TripResponse>builder()
                        .success(true)
                        .message("Trip archived successfully.")
                        .data(response)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(apiResponse);
    }
}