package com.tripwise.backend.ai.dto;

public record AIItineraryModificationResponse(

        Long itineraryId,

        String originalItinerary,

        String modifiedItinerary,

        String modificationSummary

) {
}