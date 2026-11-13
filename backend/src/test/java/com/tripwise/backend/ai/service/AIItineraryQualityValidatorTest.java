package com.tripwise.backend.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AIItineraryQualityValidatorTest {

    private ObjectMapper objectMapper;
    private AIItineraryQualityValidator validator;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        validator = new AIItineraryQualityValidator();
    }

    private String createItineraryJson(
            String destination,
            int duration,
            boolean includeActivity,
            int activityCost
    ) {
        String destinationField = destination == null
                ? ""
                : "\"destination\": \"%s\",".formatted(destination);

        String activities = includeActivity
                ? """
                  [
                    {
                      "time": "09:00 AM",
                      "name": "Visit Shillong",
                      "description": "Explore the city.",
                      "location": "Shillong",
                      "estimatedCost": %d,
                      "transportSuggestion": "Local taxi"
                    }
                  ]
                  """.formatted(activityCost)
                : "[]";

        return """
                {
                  "title": "Meghalaya Adventure",
                  %s
                  "summary": "A travel plan for Meghalaya.",
                  "duration": %d,
                  "totalEstimatedCost": 1500,
                  "currency": "INR",
                  "itinerary": [
                    {
                      "day": 1,
                      "title": "Explore Shillong",
                      "description": "Explore local attractions.",
                      "activities": %s
                    }
                  ],
                  "costBreakdown": {
                    "transportation": 300,
                    "accommodation": 500,
                    "food": 300,
                    "activities": 300,
                    "miscellaneous": 100
                  },
                  "travelTips": [
                    "Carry comfortable walking shoes."
                  ]
                }
                """.formatted(destinationField, duration, activities);
    }

    @Test
    void shouldAcceptValidItinerary() throws Exception {

        JsonNode itinerary = objectMapper.readTree(
                createItineraryJson("Meghalaya", 1, true, 500)
        );

        List<String> errors = validator.validate(itinerary, 1);

        assertTrue(
                errors.isEmpty(),
                "Expected valid itinerary but found: " + errors
        );
    }

    @Test
    void shouldRejectIncorrectDuration() throws Exception {

        JsonNode itinerary = objectMapper.readTree(
                createItineraryJson("Meghalaya", 2, true, 500)
        );

        List<String> errors = validator.validate(itinerary, 3);

        assertFalse(errors.isEmpty());

        assertTrue(
                errors.stream().anyMatch(
                        error -> error.contains("Expected 3 days")
                )
        );
    }

    @Test
    void shouldRejectEmptyActivities() throws Exception {

        JsonNode itinerary = objectMapper.readTree(
                createItineraryJson("Meghalaya", 1, false, 500)
        );

        List<String> errors = validator.validate(itinerary, 1);

        assertTrue(
                errors.stream().anyMatch(
                        error -> error.contains("has no activities")
                )
        );
    }

    @Test
    void shouldRejectMissingDestination() throws Exception {

        JsonNode itinerary = objectMapper.readTree(
                createItineraryJson(null, 1, true, 500)
        );

        List<String> errors = validator.validate(itinerary, 1);

        assertTrue(
                errors.stream().anyMatch(
                        error -> error.contains("destination")
                )
        );
    }

    @Test
    void shouldRejectNegativeActivityCost() throws Exception {

        JsonNode itinerary = objectMapper.readTree(
                createItineraryJson("Meghalaya", 1, true, -500)
        );

        List<String> errors = validator.validate(itinerary, 1);

        assertTrue(
                errors.stream().anyMatch(
                        error -> error.contains("cannot be negative")
                )
        );
    }
}