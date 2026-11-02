package com.tripwise.backend.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.tripwise.backend.ai.dto.request.AITripRequest;
import com.tripwise.backend.ai.dto.response.AIItineraryResponse;
import com.tripwise.backend.ai.dto.response.AIItineraryHistoryResponse;

import com.tripwise.backend.ai.entity.AIItinerary;
import com.tripwise.backend.ai.repository.AIItineraryRepository;
import com.tripwise.backend.ai.service.AIItineraryService;

import com.tripwise.backend.entity.User;
import com.tripwise.backend.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AIItineraryPersistenceService {

    private final AIItineraryRepository itineraryRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final AIItineraryService aiItineraryService;

    public AIItineraryPersistenceService(
            AIItineraryRepository itineraryRepository,
            UserRepository userRepository,
            ObjectMapper objectMapper,
            AIItineraryService aiItineraryService) {
        this.itineraryRepository = itineraryRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
        this.aiItineraryService = aiItineraryService;
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
    public Page<AIItineraryHistoryResponse> getUserItineraries(
            String email,
            int page,
            int size) {

        if (page < 0 || size < 1 || size > 50) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid pagination parameters"
            );
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return itineraryRepository
                .findByUserEmailOrderByCreatedAtDesc(email, pageable)
                .map(this::convertToHistoryResponse);
    }

    @Transactional(readOnly = true)
    public AIItineraryHistoryResponse getItineraryById(
            Long id,
            String email) {

        AIItinerary itinerary = findOwnedItinerary(id, email);

        return convertToHistoryResponse(itinerary);
    }

    @Transactional
    public AIItineraryHistoryResponse regenerateItinerary(
            Long id,
            String email) {

        AIItinerary itinerary = findOwnedItinerary(id, email);

        try {
            AITripRequest request = objectMapper.readValue(
                    itinerary.getRequestJson(),
                    AITripRequest.class
            );

            AIItineraryResponse response =
                    aiItineraryService.generateItinerary(request);

            itinerary.setResponseJson(
                    objectMapper.writeValueAsString(response)
            );

            AIItinerary updated = itineraryRepository.save(itinerary);

            return convertToHistoryResponse(updated);

        } catch (JsonProcessingException exception) {
            throw new IllegalStateException(
                    "Unable to process itinerary regeneration",
                    exception
            );
        }
    }

    @Transactional
    public void deleteItinerary(
            Long id,
            String email) {

        AIItinerary itinerary = findOwnedItinerary(id, email);

        itineraryRepository.delete(itinerary);
    }

    private AIItinerary findOwnedItinerary(
            Long id,
            String email) {

        return itineraryRepository
                .findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Itinerary not found"
                ));
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