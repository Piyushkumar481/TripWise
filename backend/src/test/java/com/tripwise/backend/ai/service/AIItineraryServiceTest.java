package com.tripwise.backend.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripwise.backend.ai.dto.request.AITripRequest;
import com.tripwise.backend.ai.dto.response.AIItineraryResponse;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AIItineraryServiceTest {

    @Test
    void validationRetryConsumesASeparateProviderCallAllowance() {
        AIProviderClient providerClient = mock(AIProviderClient.class);
        AIItineraryQualityValidator qualityValidator =
                mock(AIItineraryQualityValidator.class);
        ObjectMapper objectMapper = new ObjectMapper();
        AIItineraryService service = new AIItineraryService(
                providerClient,
                objectMapper,
                qualityValidator
        );

        AITripRequest request = new AITripRequest(
                "Kyoto",
                "Tokyo",
                1,
                BigDecimal.valueOf(100000),
                2,
                List.of("food"),
                "relaxed"
        );
        AIItineraryResponse invalid = new AIItineraryResponse(
                "Trip",
                "Kyoto",
                "Summary",
                2,
                BigDecimal.valueOf(100),
                "INR",
                List.of(),
                null,
                List.of()
        );
        AIItineraryResponse valid = new AIItineraryResponse(
                "Trip",
                "Kyoto",
                "Summary",
                1,
                BigDecimal.valueOf(100),
                "INR",
                List.of(new AIItineraryResponse.DayPlan(
                        1,
                        "Day one",
                        "Explore",
                        List.of(new AIItineraryResponse.Activity(
                                "09:00",
                                "Visit",
                                "Kyoto",
                                "A visit",
                                BigDecimal.TEN,
                                "Walk"
                        ))
                )),
                new AIItineraryResponse.CostBreakdown(
                        BigDecimal.ZERO,
                        BigDecimal.ZERO,
                        BigDecimal.ZERO,
                        BigDecimal.ZERO,
                        BigDecimal.ZERO
                ),
                List.of("Enjoy the trip")
        );

        when(providerClient.generateEntity(
                eq("authenticated@example.com"),
                anyString(),
                anyString(),
                eq(AIUseCase.ITINERARY),
                eq(AIItineraryResponse.class)
        )).thenReturn(invalid, valid);
        when(qualityValidator.validate(
                org.mockito.ArgumentMatchers.any(),
                eq(1)
        )).thenReturn(List.of());

        AIItineraryResponse actual = service.generateItinerary(
                request,
                "authenticated@example.com"
        );

        assertSame(valid, actual);
        verify(providerClient, times(2)).generateEntity(
                eq("authenticated@example.com"),
                anyString(),
                anyString(),
                eq(AIUseCase.ITINERARY),
                eq(AIItineraryResponse.class)
        );
    }
}
