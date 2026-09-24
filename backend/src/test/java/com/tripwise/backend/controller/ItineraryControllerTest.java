package com.tripwise.backend.controller;

import com.tripwise.backend.dto.CreateItineraryItemRequest;
import com.tripwise.backend.dto.ItineraryItemResponse;
import com.tripwise.backend.entity.ItineraryCategory;
import com.tripwise.backend.security.CustomUserDetailsService;
import com.tripwise.backend.security.JwtService;
import com.tripwise.backend.service.interfaces.ItineraryService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ItineraryController.class)
class ItineraryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ItineraryService itineraryService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldGetItineraryItems() throws Exception {

        ItineraryItemResponse response = ItineraryItemResponse.builder()
                .id(1L)
                .title("Visit Beach")
                .activityDate(LocalDate.of(2026, 9, 25))
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(12, 0))
                .category(ItineraryCategory.ACTIVITY)
                .location("Goa")
                .build();

        when(itineraryService.getItems(
                eq("user@example.com"),
                eq(1L)
        )).thenReturn(java.util.List.of(response));

        mockMvc.perform(
                get("/api/trips/1/itinerary")
        ).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldCreateItineraryItem() throws Exception {

        ItineraryItemResponse response = ItineraryItemResponse.builder()
                .id(1L)
                .title("Visit Beach")
                .activityDate(LocalDate.of(2026, 9, 25))
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(12, 0))
                .category(ItineraryCategory.ACTIVITY)
                .location("Goa")
                .build();

        when(itineraryService.createItem(
                eq("user@example.com"),
                eq(1L),
                any(CreateItineraryItemRequest.class)
        )).thenReturn(response);

        String json = "{\"title\":\"Visit Beach\",\"activityDate\":\"2026-09-25\",\"startTime\":\"10:00:00\",\"endTime\":\"12:00:00\",\"category\":\"ACTIVITY\",\"location\":\"Goa\"}";

        mockMvc.perform(
                post("/api/trips/1/itinerary")
                        .with(csrf())
                        .contentType("application/json")
                        .content(json)
        ).andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldRejectInvalidItineraryRequest() throws Exception {

        mockMvc.perform(
                post("/api/trips/1/itinerary")
                        .with(csrf())
                        .contentType("application/json")
                        .content("{}")
        ).andExpect(status().isBadRequest());
    }
}