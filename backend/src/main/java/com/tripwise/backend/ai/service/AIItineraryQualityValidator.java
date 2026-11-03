package com.tripwise.backend.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AIItineraryQualityValidator {

    public List<String> validate(JsonNode itinerary, int expectedDays) {

        List<String> errors = new ArrayList<>();

        if (itinerary == null || itinerary.isNull()) {
            errors.add("AI response is empty.");
            return errors;
        }

        if (!itinerary.isObject()) {
            errors.add("AI response must be a JSON object.");
            return errors;
        }

        validateRequiredText(itinerary, "title", errors);
        validateRequiredText(itinerary, "destination", errors);
        validateRequiredText(itinerary, "summary", errors);

        JsonNode duration = itinerary.get("duration");

        if (duration == null || !duration.isIntegralNumber()) {
            errors.add("Duration must be an integer.");
        } else if (duration.asInt() != expectedDays) {
            errors.add(
                    "Expected " + expectedDays
                            + " days but received " + duration.asInt() + "."
            );
        }

        JsonNode currency = itinerary.get("currency");

        if (currency == null
                || !currency.isTextual()
                || !"INR".equalsIgnoreCase(currency.asText().trim())) {
            errors.add("Currency must be INR.");
        }

        validateNonNegativeNumber(
                itinerary,
                "totalEstimatedCost",
                errors,
                "Itinerary"
        );

        JsonNode days = itinerary.get("itinerary");

        if (days == null || !days.isArray()) {
            errors.add("Itinerary must contain an array of day plans.");
            return errors;
        }

        if (days.size() != expectedDays) {
            errors.add(
                    "Expected " + expectedDays
                            + " itinerary days but received " + days.size() + "."
            );
        }

        for (int i = 0; i < days.size(); i++) {

            JsonNode day = days.get(i);
            int dayNumber = i + 1;

            if (!day.isObject()) {
                errors.add("Day " + dayNumber + " must be a JSON object.");
                continue;
            }

            JsonNode dayValue = day.get("day");

            if (dayValue == null || !dayValue.isIntegralNumber()) {
                errors.add("Day " + dayNumber + " is missing a valid day number.");
            } else if (dayValue.asInt() != dayNumber) {
                errors.add("Day numbering is inconsistent at day " + dayNumber + ".");
            }

            validateRequiredText(
                    day,
                    "title",
                    errors,
                    "Day " + dayNumber
            );

            validateRequiredText(
                    day,
                    "description",
                    errors,
                    "Day " + dayNumber
            );

            JsonNode activities = day.get("activities");

            if (activities == null || !activities.isArray()) {
                errors.add(
                        "Day " + dayNumber + " must contain an activities array."
                );
                continue;
            }

            if (activities.isEmpty()) {
                errors.add("Day " + dayNumber + " has no activities.");
                continue;
            }

            for (int j = 0; j < activities.size(); j++) {

                JsonNode activity = activities.get(j);
                String context = "Activity " + (j + 1) + " on day " + dayNumber;

                if (!activity.isObject()) {
                    errors.add(context + " must be a JSON object.");
                    continue;
                }

                validateRequiredText(activity, "time", errors, context);
                validateRequiredText(activity, "name", errors, context);
                validateRequiredText(activity, "location", errors, context);
                validateRequiredText(activity, "description", errors, context);
                validateRequiredText(
                        activity,
                        "transportSuggestion",
                        errors,
                        context
                );

                validateNonNegativeNumber(
                        activity,
                        "estimatedCost",
                        errors,
                        context
                );
            }
        }

        validateCostBreakdown(itinerary, errors);
        validateTravelTips(itinerary, errors);

        return errors;
    }

    private void validateCostBreakdown(
            JsonNode itinerary,
            List<String> errors
    ) {

        JsonNode breakdown = itinerary.get("costBreakdown");

        if (breakdown == null || !breakdown.isObject()) {
            errors.add("Cost breakdown must be a JSON object.");
            return;
        }

        String[] fields = {
                "transportation",
                "accommodation",
                "food",
                "activities",
                "miscellaneous"
        };

        for (String field : fields) {
            validateNonNegativeNumber(
                    breakdown,
                    field,
                    errors,
                    "Cost breakdown"
            );
        }
    }

    private void validateTravelTips(
            JsonNode itinerary,
            List<String> errors
    ) {

        JsonNode tips = itinerary.get("travelTips");

        if (tips == null || !tips.isArray()) {
            errors.add("Travel tips must be an array.");
            return;
        }

        if (tips.isEmpty()) {
            errors.add("At least one travel tip is required.");
            return;
        }

        for (int i = 0; i < tips.size(); i++) {

            JsonNode tip = tips.get(i);

            if (!tip.isTextual() || tip.asText().isBlank()) {
                errors.add("Travel tip " + (i + 1) + " is empty or invalid.");
            }
        }
    }

    private void validateRequiredText(
            JsonNode node,
            String field,
            List<String> errors
    ) {
        validateRequiredText(node, field, errors, "Itinerary");
    }

    private void validateRequiredText(
            JsonNode node,
            String field,
            List<String> errors,
            String context
    ) {

        JsonNode value = node.get(field);

        if (value == null
                || !value.isTextual()
                || value.asText().isBlank()) {

            errors.add(
                    context + " is missing required field: " + field
            );
        }
    }

    private void validateNonNegativeNumber(
            JsonNode node,
            String field,
            List<String> errors,
            String context
    ) {

        JsonNode value = node.get(field);

        if (value == null || !value.isNumber()) {
            errors.add(
                    context + " must have a numeric " + field + "."
            );
        } else if (value.asDouble() < 0) {
            errors.add(
                    context + " field " + field + " cannot be negative."
            );
        }
    }
}