package com.tripwise.backend.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.tripwise.backend.ai.dto.request.AITripRequest;
import com.tripwise.backend.ai.dto.response.AIItineraryResponse;
import com.tripwise.backend.ai.dto.response.AIItineraryHistoryResponse;

import com.tripwise.backend.ai.entity.AIItinerary;
import com.tripwise.backend.ai.repository.AIItineraryRepository;

import com.tripwise.backend.entity.User;
import com.tripwise.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AIItineraryPersistenceService {

    private final AIItineraryRepository itineraryRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public AIItineraryPersistenceService(
            AIItineraryRepository itineraryRepository,
            UserRepository userRepository,
            ObjectMapper objectMapper) {
        this.itineraryRepository = itineraryRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public AIItineraryHistoryResponse saveItinerary(
            String email,
            AITripRequest request,
            AIItineraryResponse response) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        try {
            AIItinerary itinerary = new AIItinerary();

            itinerary.setUser(user);
            itinerary.setDestination(request.destination());
            itinerary.setDuration(request.duration());
            itinerary.setBudget(request.budget());
            itinerary.setTravelers(request.travelers());

            itinerary.setRequestJson(
                    objectMapper.writeValueAsString(request)
            );

            itinerary.setResponseJson(
                    objectMapper.writeValueAsString(response)
            );

            AIItinerary saved = itineraryRepository.save(itinerary);

            return convertToHistoryResponse(saved);

        } catch (JsonProcessingException exception) {
            throw new IllegalStateException(
                    "Unable to serialize AI itinerary",
                    exception
            );
        }
    }

    @Transactional(readOnly = true)
    public List<AIItineraryHistoryResponse> getUserItineraries(
            String email) {

        return itineraryRepository
                .findByUserEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::convertToHistoryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AIItineraryHistoryResponse getItineraryById(
            Long id,
            String email) {

        AIItinerary itinerary = itineraryRepository
                .findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Itinerary not found"
                ));

        return convertToHistoryResponse(itinerary);
    }

    private AIItineraryHistoryResponse convertToHistoryResponse(
            AIItinerary itinerary) {

        try {
            AITripRequest request = objectMapper.readValue(
                    itinerary.getRequestJson(),
                    AITripRequest.class
            );

            AIItineraryResponse response = objectMapper.readValue(
                    itinerary.getResponseJson(),
                    AIItineraryResponse.class
            );

            return new AIItineraryHistoryResponse(
                    itinerary.getId(),
                    request,
                    response,
                    itinerary.getCreatedAt()
            );

        } catch (JsonProcessingException exception) {
            throw new IllegalStateException(
                    "Unable to deserialize saved itinerary",
                    exception
            );
        }
    }
}