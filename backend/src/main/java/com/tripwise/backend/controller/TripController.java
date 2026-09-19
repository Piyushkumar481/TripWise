package com.tripwise.backend.controller;

import com.tripwise.backend.dto.ApiResponse;
import com.tripwise.backend.dto.TripRequest;
import com.tripwise.backend.dto.TripResponse;
import org.springframework.data.domain.Page;
import com.tripwise.backend.service.interfaces.TripService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
@Validated
@Tag(
        name = "Trips",
        description = "Trip management APIs"
)
@SecurityRequirement(name = "bearerAuth")
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

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @Operation(
            summary = "Get my trips",
            description = "Returns all trips belonging to the authenticated user."
    )
    @GetMapping
    public ResponseEntity<ApiResponse<Page<TripResponse>>> getMyTrips(
            Authentication authentication,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "startDate") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDateFrom,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDateTo) {

        Page<TripResponse> trips =
                tripService.getMyTrips(
                        authentication.getName(),
                        page,
                        size,
                        sortBy,
                        direction,
                        search,
                        destination,
                        startDateFrom,
                        startDateTo
                );

        ApiResponse<Page<TripResponse>> response =
                ApiResponse.<Page<TripResponse>>builder()
                        .success(true)
                        .message("Trips retrieved successfully.")
                        .data(trips)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
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
    public ResponseEntity<Void> deleteTrip(
            Authentication authentication,
            @PathVariable Long id) {

        tripService.deleteTrip(
                authentication.getName(),
                id
        );

        return ResponseEntity.noContent().build();
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












