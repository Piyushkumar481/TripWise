package com.tripwise.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripwise.backend.dto.PackingItemRequest;
import com.tripwise.backend.dto.PackingItemResponse;
import com.tripwise.backend.entity.PackingCategory;
import com.tripwise.backend.exception.GlobalExceptionHandler;
import com.tripwise.backend.exception.PackingItemNotFoundException;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.security.CustomUserDetailsService;
import com.tripwise.backend.security.JwtService;
import com.tripwise.backend.service.PackingItemService;
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
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PackingItemController.class)
@Import(GlobalExceptionHandler.class)
class PackingItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper =
            new ObjectMapper().findAndRegisterModules();

    @MockitoBean
    private PackingItemService packingItemService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @WithMockUser(username = "user@example.com")
    void getPackingItemsReturnsItems() throws Exception {
        when(packingItemService.getPackingItems(1L, "user@example.com"))
                .thenReturn(List.of(createResponse()));

        mockMvc.perform(get("/api/trips/1/packing-items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(10))
                .andExpect(jsonPath("$.data[0].name").value("Phone charger"))
                .andExpect(jsonPath("$.data[0].packed").value(false));

        verify(packingItemService).getPackingItems(1L, "user@example.com");
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void createPackingItemReturnsCreated() throws Exception {
        when(packingItemService.createPackingItem(
                eq(1L), any(PackingItemRequest.class), eq("user@example.com")
        )).thenReturn(createResponse());

        mockMvc.perform(post("/api/trips/1/packing-items")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Phone charger"));
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void createPackingItemRejectsBlankName() throws Exception {
        PackingItemRequest request = createRequest();
        request.setName(" ");

        mockMvc.perform(post("/api/trips/1/packing-items")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void updatePackingItemReturnsUpdatedItem() throws Exception {
        PackingItemRequest request = createRequest();
        request.setName("Updated charger");

        PackingItemResponse response = createResponse();
        response.setName("Updated charger");

        when(packingItemService.updatePackingItem(
                eq(1L), eq(10L), any(PackingItemRequest.class),
                eq("user@example.com")
        )).thenReturn(response);

        mockMvc.perform(put("/api/trips/1/packing-items/10")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Updated charger"));
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void updatePackedStatusReturnsUpdatedItem() throws Exception {
        PackingItemResponse response = createResponse();
        response.setPacked(true);

        when(packingItemService.updatePackedStatus(
                1L, 10L, true, "user@example.com"
        )).thenReturn(response);

        mockMvc.perform(patch("/api/trips/1/packing-items/10/packed")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"packed\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.packed").value(true));
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void updatePackedStatusRejectsMissingValue() throws Exception {
        mockMvc.perform(patch("/api/trips/1/packing-items/10/packed")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void deletePackingItemReturnsNoContent() throws Exception {
        doNothing().when(packingItemService).deletePackingItem(
                1L, 10L, "user@example.com"
        );

        mockMvc.perform(delete("/api/trips/1/packing-items/10").with(csrf()))
                .andExpect(status().isNoContent());

        verify(packingItemService).deletePackingItem(
                1L, 10L, "user@example.com"
        );
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void getPackingItemsForMissingTripReturnsNotFound() throws Exception {
        when(packingItemService.getPackingItems(999L, "user@example.com"))
                .thenThrow(new TripNotFoundException("Trip not found"));

        mockMvc.perform(get("/api/trips/999/packing-items"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void updateMissingPackingItemReturnsNotFound() throws Exception {
        when(packingItemService.updatePackedStatus(
                1L, 999L, true, "user@example.com"
        )).thenThrow(new PackingItemNotFoundException("Packing item not found"));

        mockMvc.perform(patch("/api/trips/1/packing-items/999/packed")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"packed\":true}"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void getPackingProgressReturnsCorrectValues() throws Exception {
        when(packingItemService.getTotalItems(1L, "user@example.com"))
                .thenReturn(10L);
        when(packingItemService.getPackedItems(1L, "user@example.com"))
                .thenReturn(7L);

        mockMvc.perform(get("/api/trips/1/packing-items/progress"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalItems").value(10))
                .andExpect(jsonPath("$.data.packedItems").value(7))
                .andExpect(jsonPath("$.data.unpackedItems").value(3))
                .andExpect(jsonPath("$.data.percentage").value(70.0));
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void getPackingProgressForEmptyListReturnsZeroPercent() throws Exception {
        when(packingItemService.getTotalItems(1L, "user@example.com"))
                .thenReturn(0L);
        when(packingItemService.getPackedItems(1L, "user@example.com"))
                .thenReturn(0L);

        mockMvc.perform(get("/api/trips/1/packing-items/progress"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.percentage").value(0.0));
    }

    private PackingItemRequest createRequest() {
        PackingItemRequest request = new PackingItemRequest();
        request.setName("Phone charger");
        request.setDescription("USB-C charger");
        request.setCategory(PackingCategory.ELECTRONICS);
        request.setQuantity(1);
        request.setPacked(false);
        return request;
    }

    private PackingItemResponse createResponse() {
        return PackingItemResponse.builder()
                .id(10L)
                .tripId(1L)
                .name("Phone charger")
                .description("USB-C charger")
                .category(PackingCategory.ELECTRONICS)
                .quantity(1)
                .packed(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
}