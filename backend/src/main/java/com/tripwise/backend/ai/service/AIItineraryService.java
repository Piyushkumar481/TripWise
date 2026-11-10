package com.tripwise.backend.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.tripwise.backend.exception.AIServiceUnavailableException;

import com.tripwise.backend.ai.dto.request.AITripRequest;
import com.tripwise.backend.ai.dto.response.AIItineraryResponse;
import com.tripwise.backend.exception.AIQuotaExceededException;
import org.springframework.stereotype.Service;

@Service
public class AIItineraryService {

    private final AIProviderClient aiProviderClient;
    private final ObjectMapper objectMapper;
    private final AIItineraryQualityValidator qualityValidator;

    public AIItineraryService(
            AIProviderClient aiProviderClient,
            ObjectMapper objectMapper,
            AIItineraryQualityValidator qualityValidator) {
        this.aiProviderClient = aiProviderClient;
        this.objectMapper = objectMapper;
        this.qualityValidator = qualityValidator;
    }

    public AIItineraryResponse generateItinerary(
            AITripRequest request,
            String authenticatedUserEmail) {

        String interests = String.join(", ", request.interests());

        String systemPrompt = """
                You are TripWise AI, an intelligent and reliable travel planning assistant.

                Generate complete, practical, personalized, and logically
                structured travel itineraries.

                USER REQUIREMENTS:
                - Respect the requested destination.
                - Respect the requested trip duration.
                - Consider the starting location.
                - Consider the total budget for all travellers.
                - Consider the number of travellers.
                - Consider the selected interests and travel style.

                ITINERARY QUALITY RULES:

                1. Generate exactly the requested number of days.
                2. Number days sequentially, beginning with 1.
                3. Every day must have a meaningful title and description.
                4. Every day must contain at least one activity.
                5. Every activity must have a time, name, location,
                   description, estimated cost, and transport suggestion.
                6. Organize activities into a logical daily schedule.
                7. Avoid overlapping activities.
                8. Consider geographical distance and reasonable travel time.
                9. Include reasonable meal breaks and rest periods.
                10. Avoid unnecessary repetition of attractions.
                11. Personalize recommendations according to the user's
                    interests and travel style.

                BUDGET RULES:

                12. Express all monetary values in INR.
                13. Use numeric values for all monetary fields.
                14. The total estimated cost must represent all travellers.
                15. Include transportation, accommodation, food,
                    activities, and miscellaneous expenses.
                16. Provide a complete cost breakdown.
                17. Keep the estimated costs consistent with the total budget.
                18. If the budget is insufficient, explain this in the summary
                    and suggest practical alternatives.
                19. Treat all prices as estimates, not guarantees.

                ACCURACY RULES:

                20. Never invent confirmed booking availability.
                21. Never invent live weather information.
                22. Never invent current ticket prices, opening hours,
                    or transportation schedules.
                23. Avoid unsafe or inaccessible travel suggestions.
                24. Do not leave required response fields empty.

                RESPONSE STRUCTURE:

                Return structured data matching the existing
                AIItineraryResponse DTO exactly.

                Required top-level fields:
                - title
                - destination
                - summary
                - duration
                - totalEstimatedCost
                - currency
                - itinerary
                - costBreakdown
                - travelTips

                The itinerary field must be an array of day plans.

                Each day plan must contain:
                - day
                - title
                - description
                - activities

                Each activity must contain:
                - time
                - name
                - location
                - description
                - estimatedCost
                - transportSuggestion

                The costBreakdown object must contain:
                - transportation
                - accommodation
                - food
                - activities
                - miscellaneous

                The travelTips field must be an array of useful travel tips.

                OUTPUT RULES:

                - Use "itinerary", not "days".
                - Use "day", not "dayNumber".
                - Use all existing DTO field names.
                - Set currency to INR.
                - Return structured output only.
                - Do not include Markdown or additional explanations.
                """;

        String userPrompt = """
                Create a detailed travel itinerary using these details:

                Destination: %s
                Starting Location: %s
                Duration: %d days
                Total Budget: INR %s
                Number of Travellers: %d
                Interests: %s
                Travel Style: %s

                Generate exactly %d day plans.
                All estimated costs must be in INR.
                """.formatted(
                request.destination(),
                request.startingLocation(),
                request.duration(),
                request.budget(),
                request.travelers(),
                interests,
                request.travelStyle(),
                request.duration()
        );

        AIItineraryResponse response = null;
        IllegalStateException lastValidationException = null;

        for (int attempt = 1; attempt <= 2; attempt++) {

            String attemptPrompt = userPrompt;

            if (attempt > 1 && lastValidationException != null) {

                attemptPrompt = userPrompt + """

                        Your previous response failed structural validation.

                        Validation errors:
                        %s

                        Generate a corrected itinerary.

                        Follow every original requirement.
                        Preserve the original destination and travel preferences.
                        Return the complete corrected response.
                        Do not omit any required field.
                        """.formatted(lastValidationException.getMessage());

            }

            try {
                response = aiProviderClient.generateEntity(
                        authenticatedUserEmail,
                        systemPrompt,
                        attemptPrompt,
                        AIUseCase.ITINERARY,
                        AIItineraryResponse.class
                );

            } catch (RuntimeException exception) {

                if (isQuotaExceeded(exception)) {
                    throw new AIQuotaExceededException();
                }

                if (isModelUnavailable(exception)) {
                    throw new AIServiceUnavailableException();
                }

                throw exception;
            }

            try {
                validateResponse(response, request);

                return response;

            } catch (IllegalStateException validationException) {

                lastValidationException = validationException;

                if (attempt == 2) {
                    throw new IllegalStateException(
                            "AI could not generate a valid itinerary after "
                                    + "two attempts. Validation errors: "
                                    + validationException.getMessage(),
                            validationException
                    );
                }
            }
        }

        throw new IllegalStateException(
                "AI itinerary generation failed after two attempts."
        );
    }

    private void validateResponse(
            AIItineraryResponse response,
            AITripRequest request) {

        if (response == null) {
            throw new IllegalStateException(
                    "AI returned an empty itinerary response");
        }

        if (response.title() == null
                || response.destination() == null
                || response.summary() == null) {
            throw new IllegalStateException(
                    "AI returned incomplete itinerary details");
        }

        if (response.duration() == null
                || !response.duration().equals(request.duration())) {
            throw new IllegalStateException(
                    "AI returned an incorrect trip duration");
        }

        if (response.itinerary() == null
                || response.itinerary().size() != request.duration()) {
            throw new IllegalStateException(
                    "AI must return exactly " + request.duration() + " days");
        }

        for (int i = 0; i < response.itinerary().size(); i++) {

            AIItineraryResponse.DayPlan day = response.itinerary().get(i);

            if (day == null || day.day() == null || day.day() != i + 1) {
                throw new IllegalStateException(
                        "AI returned an invalid day sequence");
            }

            if (day.activities() == null || day.activities().isEmpty()) {
                throw new IllegalStateException(
                        "Each day must contain at least one activity");
            }
        }

        if (response.totalEstimatedCost() == null
                || response.totalEstimatedCost().signum() < 0) {
            throw new IllegalStateException(
                    "AI returned an invalid estimated total cost");
        }

        var qualityErrors = qualityValidator.validate(
                objectMapper.valueToTree(response),
                request.duration()
        );

        if (!qualityErrors.isEmpty()) {
            throw new IllegalStateException(
                    "AI itinerary quality validation failed: "
                            + String.join("; ", qualityErrors)
            );
        }
    }

    private boolean isQuotaExceeded(Throwable throwable) {

        Throwable current = throwable;

        while (current != null) {

            String message = current.getMessage();

            if (message != null) {

                String normalized =
                        message.toLowerCase(java.util.Locale.ROOT);

                if (normalized.contains("quota")
                        || normalized.contains("resource_exhausted")
                        || normalized.contains("resource exhausted")
                        || normalized.contains("429")
                        || normalized.contains("rate limit")
                        || normalized.contains("too many requests")) {

                    return true;
                }
            }

            current = current.getCause();
        }

        return false;
    }

    private boolean isModelUnavailable(Throwable throwable) {

        Throwable current = throwable;

        while (current != null) {

            String message = current.getMessage();

            if (message != null) {

                String normalized =
                        message.toLowerCase(java.util.Locale.ROOT);

                if (normalized.contains("503")
                        || normalized.contains("high demand")
                        || normalized.contains("service unavailable")
                        || normalized.contains("temporarily unavailable")) {
                    return true;
                }
            }

            current = current.getCause();
        }

        return false;
    }
}
