package com.tripwise.backend.ai.service;

import com.tripwise.backend.exception.AIServiceUnavailableException;

import com.tripwise.backend.ai.dto.request.AITripRequest;
import com.tripwise.backend.ai.dto.response.AIItineraryResponse;
import com.tripwise.backend.exception.AIQuotaExceededException;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AIItineraryService {

    private final ChatClient chatClient;

    public AIItineraryService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public AIItineraryResponse generateItinerary(AITripRequest request) {

        String interests = String.join(", ", request.interests());

        String systemPrompt = """
                You are TripWise AI, an expert travel planner.

                Generate practical, personalized travel itineraries.

                Follow these rules:
                1. Return exactly the requested number of days.
                2. Include morning, afternoon, and evening activities.
                3. Consider the destination, starting location, budget,
                   number of travellers, interests, and travel style.
                4. Include realistic estimated costs in INR.
                5. The total estimated cost must represent all travellers.
                6. Include transportation, accommodation, food,
                   activities, and miscellaneous expenses.
                7. Keep the plan within the given budget whenever practical.
                8. If the budget is insufficient, explain this in the summary
                   and suggest the closest practical alternative.
                9. Consider geographical distance and travel time between places.
                10. Include practical travel tips.
                11. Never invent live ticket prices, availability,
                    opening hours, or transport schedules.
                12. Treat all prices as estimates, not guarantees.
                13. Avoid unsafe or inaccessible travel routes.
                14. Return structured data matching the requested
                    AIItineraryResponse format.
                15. Do not include Markdown or additional text.
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

        AIItineraryResponse response;

        try {
            response = chatClient.prompt()
                    .system(systemPrompt)
                    .user(userPrompt)
                    .call()
                    .entity(AIItineraryResponse.class);
        } catch (RuntimeException exception) {
            if (isQuotaExceeded(exception)) {
                throw new AIQuotaExceededException();
            }

            if (isModelUnavailable(exception)) {
                throw new AIServiceUnavailableException();
            }

            throw exception;
        }

        validateResponse(response, request);

        return response;
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
