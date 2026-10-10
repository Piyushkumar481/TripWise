package com.tripwise.backend.controller;

import com.tripwise.backend.dto.ApiResponse;
import com.tripwise.backend.dto.PackingItemRequest;
import com.tripwise.backend.dto.PackingItemResponse;
import com.tripwise.backend.service.PackingItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips/{tripId}/packing-items")
@RequiredArgsConstructor
public class PackingItemController {

    private final PackingItemService packingItemService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PackingItemResponse>>> getPackingItems(
            @PathVariable Long tripId,
            Authentication authentication) {

        List<PackingItemResponse> items =
                packingItemService.getPackingItems(
                        tripId,
                        authentication.getName()
                );

        return ResponseEntity.ok(
                ApiResponse.<List<PackingItemResponse>>builder()
                        .success(true)
                        .message("Packing items retrieved successfully.")
                        .data(items)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PackingItemResponse>> createPackingItem(
            @PathVariable Long tripId,
            @Valid @RequestBody PackingItemRequest request,
            Authentication authentication) {

        PackingItemResponse item =
                packingItemService.createPackingItem(
                        tripId,
                        request,
                        authentication.getName()
                );

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<PackingItemResponse>builder()
                        .success(true)
                        .message("Packing item created successfully.")
                        .data(item)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<ApiResponse<PackingItemResponse>> updatePackingItem(
            @PathVariable Long tripId,
            @PathVariable Long itemId,
            @Valid @RequestBody PackingItemRequest request,
            Authentication authentication) {

        PackingItemResponse item =
                packingItemService.updatePackingItem(
                        tripId,
                        itemId,
                        request,
                        authentication.getName()
                );

        return ResponseEntity.ok(
                ApiResponse.<PackingItemResponse>builder()
                        .success(true)
                        .message("Packing item updated successfully.")
                        .data(item)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @PatchMapping("/{itemId}/packed")
    public ResponseEntity<ApiResponse<PackingItemResponse>> updatePackedStatus(
            @PathVariable Long tripId,
            @PathVariable Long itemId,
            @RequestBody(required = false) PackedStatusRequest request,
            Authentication authentication) {

        if (request == null || request.packed() == null) {
            throw new IllegalArgumentException("Packed status is required.");
        }

        PackingItemResponse item =
                packingItemService.updatePackedStatus(
                        tripId,
                        itemId,
                        request.packed(),
                        authentication.getName()
                );

        return ResponseEntity.ok(
                ApiResponse.<PackingItemResponse>builder()
                        .success(true)
                        .message("Packing status updated successfully.")
                        .data(item)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deletePackingItem(
            @PathVariable Long tripId,
            @PathVariable Long itemId,
            Authentication authentication) {

        packingItemService.deletePackingItem(
                tripId,
                itemId,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/progress")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPackingProgress(
            @PathVariable Long tripId,
            Authentication authentication) {

        String userEmail = authentication.getName();

        long total = packingItemService.getTotalItems(tripId, userEmail);
        long packed = packingItemService.getPackedItems(tripId, userEmail);

        double percentage = total == 0
                ? 0.0
                : Math.round((packed * 10000.0) / total) / 100.0;

        Map<String, Object> progress = Map.of(
                "totalItems", total,
                "packedItems", packed,
                "unpackedItems", total - packed,
                "percentage", percentage
        );

        return ResponseEntity.ok(
                ApiResponse.<Map<String, Object>>builder()
                        .success(true)
                        .message("Packing progress retrieved successfully.")
                        .data(progress)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    public record PackedStatusRequest(Boolean packed) {
    }
}