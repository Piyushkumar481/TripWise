package com.tripwise.backend.service.interfaces;

import com.tripwise.backend.dto.CreateItineraryItemRequest;
import com.tripwise.backend.dto.ItineraryItemResponse;

import java.util.List;

public interface ItineraryService {

    ItineraryItemResponse createItem(
            String email,
            Long tripId,
            CreateItineraryItemRequest request
    );

    List<ItineraryItemResponse> getItems(
            String email,
            Long tripId
    );

    ItineraryItemResponse getItem(
            String email,
            Long tripId,
            Long itemId
    );

    ItineraryItemResponse updateItem(
            String email,
            Long tripId,
            Long itemId,
            CreateItineraryItemRequest request
    );

    void deleteItem(
            String email,
            Long tripId,
            Long itemId
    );
}