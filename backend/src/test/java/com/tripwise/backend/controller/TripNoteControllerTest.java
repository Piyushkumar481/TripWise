package com.tripwise.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripwise.backend.dto.TripNoteRequest;
import com.tripwise.backend.dto.TripNoteResponse;
import com.tripwise.backend.exception.GlobalExceptionHandler;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.security.CustomUserDetailsService;
import com.tripwise.backend.security.JwtService;
import com.tripwise.backend.service.TripNoteService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TripNoteController.class)
@Import(GlobalExceptionHandler.class)
class TripNoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper =
            new ObjectMapper().findAndRegisterModules();

    @MockitoBean
    private TripNoteService tripNoteService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    private TripNoteRequest createRequest() {
        TripNoteRequest request = new TripNoteRequest();
        request.setTitle("Flight Details");
        request.setContent("Flight departs at 9 AM");
        request.setPinned(false);
        return request;
    }

    private TripNoteResponse createResponse() {
        return TripNoteResponse.builder()
                .id(10L)
                .tripId(1L)
                .title("Flight Details")
                .content("Flight departs at 9 AM")
                .pinned(false)
                .createdAt(LocalDateTime.of(2026, 10, 1, 10, 0))
                .updatedAt(LocalDateTime.of(2026, 10, 1, 10, 0))
                .build();
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void getNotesReturnsNotes() throws Exception {
        when(tripNoteService.getNotes(1L, "user@example.com"))
                .thenReturn(List.of(createResponse()));

        mockMvc.perform(get("/api/trips/1/notes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(10))
                .andExpect(jsonPath("$.data[0].title").value("Flight Details"));

        verify(tripNoteService).getNotes(1L, "user@example.com");
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void getNoteReturnsNote() throws Exception {
        when(tripNoteService.getNote(1L, 10L, "user@example.com"))
                .thenReturn(createResponse());

        mockMvc.perform(get("/api/trips/1/notes/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(10))
                .andExpect(jsonPath("$.data.title").value("Flight Details"));
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void createNoteReturnsCreated() throws Exception {
        when(tripNoteService.createNote(
                eq(1L),
                any(TripNoteRequest.class),
                eq("user@example.com")
        )).thenReturn(createResponse());

        mockMvc.perform(post("/api/trips/1/notes")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Flight Details"));
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void createNoteRejectsBlankTitle() throws Exception {
        TripNoteRequest request = createRequest();
        request.setTitle(" ");

        mockMvc.perform(post("/api/trips/1/notes")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(tripNoteService);
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void updateNoteReturnsUpdatedNote() throws Exception {
        TripNoteResponse response = createResponse();
        response.setTitle("Updated Flight Details");

        when(tripNoteService.updateNote(
                eq(1L),
                eq(10L),
                any(TripNoteRequest.class),
                eq("user@example.com")
        )).thenReturn(response);

        TripNoteRequest request = createRequest();
        request.setTitle("Updated Flight Details");

        mockMvc.perform(put("/api/trips/1/notes/10")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Updated Flight Details"));
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void updatePinnedStatusReturnsUpdatedNote() throws Exception {
        TripNoteResponse response = createResponse();
        response.setPinned(true);

        when(tripNoteService.updatePinnedStatus(
                1L, 10L, true, "user@example.com"
        )).thenReturn(response);

        mockMvc.perform(patch("/api/trips/1/notes/10/pinned")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"pinned\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.pinned").value(true));
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void updatePinnedStatusRejectsMissingValue() throws Exception {
        mockMvc.perform(patch("/api/trips/1/notes/10/pinned")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void deleteNoteReturnsNoContent() throws Exception {
        doNothing().when(tripNoteService)
                .deleteNote(1L, 10L, "user@example.com");

        mockMvc.perform(delete("/api/trips/1/notes/10").with(csrf()))
                .andExpect(status().isNoContent());

        verify(tripNoteService)
                .deleteNote(1L, 10L, "user@example.com");
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void getMissingNoteReturnsNotFound() throws Exception {
        when(tripNoteService.getNote(1L, 99L, "user@example.com"))
                .thenThrow(new TripNotFoundException("Note not found"));

        mockMvc.perform(get("/api/trips/1/notes/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void getSummaryReturnsCounts() throws Exception {
        when(tripNoteService.getTotalNotes(1L, "user@example.com"))
                .thenReturn(5L);

        when(tripNoteService.getPinnedNotes(1L, "user@example.com"))
                .thenReturn(2L);

        mockMvc.perform(get("/api/trips/1/notes/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalNotes").value(5))
                .andExpect(jsonPath("$.data.pinnedNotes").value(2))
                .andExpect(jsonPath("$.data.unpinnedNotes").value(3));
    }
}
