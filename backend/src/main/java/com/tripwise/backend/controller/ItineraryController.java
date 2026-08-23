package com.tripwise.backend.controller;

import com.tripwise.backend.dto.ApiResponse;
import com.tripwise.backend.dto.CreateItineraryItemRequest;
import com.tripwise.backend.dto.ItineraryItemResponse;
import com.tripwise.backend.service.interfaces.ItineraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/itinerary")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping
    public ResponseEntity<ApiResponse<ItineraryItemResponse>>
    createItem(
            Authentication authentication,
            @PathVariable Long tripId,
            @Valid @RequestBody
            CreateItineraryItemRequest request) {

        ItineraryItemResponse item =
                itineraryService.createItem(
                        authentication.getName(),
                        tripId,
                        request
                );

        ApiResponse<ItineraryItemResponse> response =
                ApiResponse.<ItineraryItemResponse>builder()
                        .success(true)
                        .message(
                                "Itinerary item created successfully."
                        )
                        .data(item)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<ItineraryItemResponse>>>
    getItems(
            Authentication authentication,
            @PathVariable Long tripId) {

        List<ItineraryItemResponse> items =
                itineraryService.getItems(
                        authentication.getName(),
                        tripId
                );

        ApiResponse<List<ItineraryItemResponse>> response =
                ApiResponse.<List<ItineraryItemResponse>>builder()
                        .success(true)
                        .message(
                                "Itinerary retrieved successfully."
                        )
                        .data(items)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{itemId:\\d+}")
    public ResponseEntity<ApiResponse<ItineraryItemResponse>>
    getItem(
            Authentication authentication,
            @PathVariable Long tripId,
            @PathVariable Long itemId) {

        ItineraryItemResponse item =
                itineraryService.getItem(
                        authentication.getName(),
                        tripId,
                        itemId
                );

        ApiResponse<ItineraryItemResponse> response =
                ApiResponse.<ItineraryItemResponse>builder()
                        .success(true)
                        .message(
                                "Itinerary item retrieved successfully."
                        )
                        .data(item)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{itemId:\\d+}")
    public ResponseEntity<ApiResponse<ItineraryItemResponse>>
    updateItem(
            Authentication authentication,
            @PathVariable Long tripId,
            @PathVariable Long itemId,
            @Valid @RequestBody
            CreateItineraryItemRequest request) {

        ItineraryItemResponse item =
                itineraryService.updateItem(
                        authentication.getName(),
                        tripId,
                        itemId,
                        request
                );

        ApiResponse<ItineraryItemResponse> response =
                ApiResponse.<ItineraryItemResponse>builder()
                        .success(true)
                        .message(
                                "Itinerary item updated successfully."
                        )
                        .data(item)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{itemId:\\d+}")
    public ResponseEntity<ApiResponse<Void>>
    deleteItem(
            Authentication authentication,
            @PathVariable Long tripId,
            @PathVariable Long itemId) {

        itineraryService.deleteItem(
                authentication.getName(),
                tripId,
                itemId
        );

        ApiResponse<Void> response =
                ApiResponse.<Void>builder()
                        .success(true)
                        .message(
                                "Itinerary item deleted successfully."
                        )
                        .data(null)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }
}