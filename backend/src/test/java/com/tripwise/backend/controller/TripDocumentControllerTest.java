package com.tripwise.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripwise.backend.dto.DocumentRequest;
import com.tripwise.backend.dto.TripDocumentResponse;
import com.tripwise.backend.entity.DocumentCategory;
import com.tripwise.backend.exception.DocumentNotFoundException;
import com.tripwise.backend.exception.GlobalExceptionHandler;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.service.TripDocumentService;
import com.tripwise.backend.security.JwtService;
import com.tripwise.backend.security.CustomUserDetailsService;
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
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TripDocumentController.class)
@Import(GlobalExceptionHandler.class)
class TripDocumentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper =
            new ObjectMapper().findAndRegisterModules();

    @MockitoBean
    private TripDocumentService tripDocumentService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldGetDocuments() throws Exception {
        TripDocumentResponse response = createResponse();

        when(tripDocumentService.getDocuments(
                1L,
                "user@example.com"
        )).thenReturn(List.of(response));

        mockMvc.perform(get("/api/trips/1/document-metadata"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(100))
                .andExpect(jsonPath("$.data[0].title")
                        .value("Flight Ticket"))
                .andExpect(jsonPath("$.data[0].category")
                        .value("FLIGHTS"));

        verify(tripDocumentService)
                .getDocuments(1L, "user@example.com");
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldUpdateDocument() throws Exception {
        DocumentRequest request = createRequest(
                "Updated Flight Ticket",
                "Updated booking information"
        );

        TripDocumentResponse response = TripDocumentResponse.builder()
                .id(100L)
                .tripId(1L)
                .title("Updated Flight Ticket")
                .description("Updated booking information")
                .originalFileName("flight.pdf")
                .category(DocumentCategory.FLIGHTS)
                .contentType("application/pdf")
                .fileSize(2048L)
                .uploadedAt(LocalDateTime.now())
                .build();

        when(tripDocumentService.updateDocument(
                eq(1L),
                eq(100L),
                any(DocumentRequest.class),
                eq("user@example.com")
        )).thenReturn(response);

        mockMvc.perform(
                put("/api/trips/1/document-metadata/100")
                        .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(100))
                .andExpect(jsonPath("$.data.title")
                        .value("Updated Flight Ticket"));

        verify(tripDocumentService).updateDocument(
                eq(1L),
                eq(100L),
                any(DocumentRequest.class),
                eq("user@example.com")
        );
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldRejectBlankDocumentTitle() throws Exception {
        DocumentRequest request = createRequest(" ", "Description");

        mockMvc.perform(
                put("/api/trips/1/document-metadata/100")
                        .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
        )
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldReturn404WhenTripDoesNotExist() throws Exception {
        when(tripDocumentService.getDocuments(
                999L,
                "user@example.com"
        )).thenThrow(new TripNotFoundException("Trip not found"));

        mockMvc.perform(get("/api/trips/999/document-metadata"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldReturn404WhenDocumentDoesNotExist() throws Exception {
        DocumentRequest request = createRequest(
                "Flight Ticket",
                "Booking information"
        );

        when(tripDocumentService.updateDocument(
                eq(1L),
                eq(100L),
                any(DocumentRequest.class),
                eq("user@example.com")
        )).thenThrow(
                new DocumentNotFoundException("Document not found")
        );

        mockMvc.perform(
                put("/api/trips/1/document-metadata/100")
                        .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
        )
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldDeleteDocument() throws Exception {
        doNothing().when(tripDocumentService).deleteDocument(
                1L,
                100L,
                "user@example.com"
        );

        mockMvc.perform(delete("/api/trips/1/document-metadata/100")
                        .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isNoContent());

        verify(tripDocumentService).deleteDocument(
                1L,
                100L,
                "user@example.com"
        );
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void shouldReturn404WhenDeletingMissingDocument() throws Exception {
        doThrow(new DocumentNotFoundException("Document not found"))
                .when(tripDocumentService)
                .deleteDocument(1L, 100L, "user@example.com");

        mockMvc.perform(delete("/api/trips/1/document-metadata/100")
                        .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isNotFound());
    }

    private DocumentRequest createRequest(
            String title,
            String description
    ) {
        DocumentRequest request = new DocumentRequest();
        request.setTitle(title);
        request.setDescription(description);
        request.setCategory(DocumentCategory.FLIGHTS);
        return request;
    }

    private TripDocumentResponse createResponse() {
        return TripDocumentResponse.builder()
                .id(100L)
                .tripId(1L)
                .title("Flight Ticket")
                .description("Return flight booking")
                .originalFileName("flight.pdf")
                .category(DocumentCategory.FLIGHTS)
                .contentType("application/pdf")
                .fileSize(2048L)
                .uploadedAt(LocalDateTime.now())
                .build();
    }
}