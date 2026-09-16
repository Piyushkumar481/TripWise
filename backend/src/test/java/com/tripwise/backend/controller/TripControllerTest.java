package com.tripwise.backend.controller;

import com.tripwise.backend.dto.TripResponse;
import com.tripwise.backend.security.CustomUserDetailsService;
import com.tripwise.backend.security.JwtService;
import com.tripwise.backend.service.interfaces.TripService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TripController.class)
class TripControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TripService tripService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldGetMyTrips() throws Exception {

        Page<TripResponse> page = new PageImpl<>(List.of());

        when(tripService.getMyTrips(
                "user@example.com",
                0,
                10,
                "startDate",
                "asc",
                null,
                null,
                null,
                null
        )).thenReturn(page);

        mockMvc.perform(get("/api/trips"))
                .andExpect(status().isOk());

        verify(tripService).getMyTrips(
                "user@example.com",
                0,
                10,
                "startDate",
                "asc",
                null,
                null,
                null,
                null
        );
    }
}

