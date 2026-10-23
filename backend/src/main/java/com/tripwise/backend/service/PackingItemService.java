package com.tripwise.backend.service;

import com.tripwise.backend.dto.PackingItemRequest;
import com.tripwise.backend.dto.PackingItemResponse;
import com.tripwise.backend.entity.PackingItem;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.exception.PackingItemNotFoundException;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.repository.PackingItemRepository;
import com.tripwise.backend.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PackingItemService {

    private final PackingItemRepository packingItemRepository;
    private final TripRepository tripRepository;

    public List<PackingItemResponse> getPackingItems(
            Long tripId,
            String userEmail) {

        getOwnedTrip(tripId, userEmail);

        return packingItemRepository
                .findByTripIdOrderByCreatedAtDesc(tripId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public PackingItemResponse createPackingItem(
            Long tripId,
            PackingItemRequest request,
            String userEmail) {

        Trip trip = getOwnedTrip(tripId, userEmail);
        validateRequest(request);

        PackingItem item = PackingItem.builder()
                .trip(trip)
                .name(request.getName().trim())
                .description(normalizeOptionalText(request.getDescription()))
                .category(request.getCategory())
                .quantity(request.getQuantity())
                .packed(request.getPacked())
                .build();

        return mapToResponse(packingItemRepository.save(item));
    }

    @Transactional
    public PackingItemResponse updatePackingItem(
            Long tripId,
            Long itemId,
            PackingItemRequest request,
            String userEmail) {

        getOwnedTrip(tripId, userEmail);
        validateRequest(request);

        PackingItem item = getPackingItem(tripId, itemId);

        item.setName(request.getName().trim());
        item.setDescription(normalizeOptionalText(request.getDescription()));
        item.setCategory(request.getCategory());
        item.setQuantity(request.getQuantity());
        item.setPacked(request.getPacked());

        return mapToResponse(packingItemRepository.save(item));
    }

    @Transactional
    public PackingItemResponse updatePackedStatus(
            Long tripId,
            Long itemId,
            boolean packed,
            String userEmail) {

        getOwnedTrip(tripId, userEmail);

        PackingItem item = getPackingItem(tripId, itemId);
        item.setPacked(packed);

        return mapToResponse(packingItemRepository.save(item));
    }

    @Transactional
    public void deletePackingItem(
            Long tripId,
            Long itemId,
            String userEmail) {

        getOwnedTrip(tripId, userEmail);

        PackingItem item = getPackingItem(tripId, itemId);
        packingItemRepository.delete(item);
    }

    public long getTotalItems(Long tripId, String userEmail) {
        getOwnedTrip(tripId, userEmail);
        return packingItemRepository.countByTripId(tripId);
    }

    public long getPackedItems(Long tripId, String userEmail) {
        getOwnedTrip(tripId, userEmail);
        return packingItemRepository.countByTripIdAndPacked(tripId, true);
    }

    private Trip getOwnedTrip(Long tripId, String userEmail) {
        return tripRepository
                .findByIdAndUserEmail(tripId, userEmail)
                .orElseThrow(() ->
                        new TripNotFoundException("Trip not found"));
    }

    private PackingItem getPackingItem(Long tripId, Long itemId) {
        return packingItemRepository
                .findByIdAndTripId(itemId, tripId)
                .orElseThrow(() ->
                        new PackingItemNotFoundException(
                                "Packing item not found"));
    }

    private void validateRequest(PackingItemRequest request) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Packing item request is required");
        }

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Item name is required");
        }

        if (request.getName().trim().length() > 150) {
            throw new IllegalArgumentException(
                    "Item name must not exceed 150 characters");
        }

        if (request.getDescription() != null
                && request.getDescription().length() > 500) {
            throw new IllegalArgumentException(
                    "Description must not exceed 500 characters");
        }

        if (request.getCategory() == null) {
            throw new IllegalArgumentException("Category is required");
        }

        if (request.getQuantity() == null || request.getQuantity() < 1) {
            throw new IllegalArgumentException(
                    "Quantity must be at least 1");
        }

        if (request.getPacked() == null) {
            throw new IllegalArgumentException(
                    "Packed status is required");
        }
    }

    private String normalizeOptionalText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private PackingItemResponse mapToResponse(PackingItem item) {
        return PackingItemResponse.builder()
                .id(item.getId())
                .tripId(item.getTrip().getId())
                .name(item.getName())
                .description(item.getDescription())
                .category(item.getCategory())
                .quantity(item.getQuantity())
                .packed(item.isPacked())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
