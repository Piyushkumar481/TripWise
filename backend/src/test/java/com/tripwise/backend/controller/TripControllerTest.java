package com.tripwise.backend.controller;

import com.tripwise.backend.dto.TripResponse;
import com.tripwise.backend.security.CustomUserDetailsService;
import com.tripwise.backend.security.JwtService;
import com.tripwise.backend.service.interfaces.TripService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
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

        when(tripService.getMyTrips("user@example.com"))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/trips"))
                .andExpect(status().isOk());

        verify(tripService).getMyTrips("user@example.com");
    }
}
