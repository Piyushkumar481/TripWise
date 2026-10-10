package com.tripwise.backend.service;

import com.tripwise.backend.dto.PackingItemRequest;
import com.tripwise.backend.dto.PackingItemResponse;
import com.tripwise.backend.entity.PackingCategory;
import com.tripwise.backend.entity.PackingItem;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.exception.PackingItemNotFoundException;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.repository.PackingItemRepository;
import com.tripwise.backend.repository.TripRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PackingItemServiceTest {

    private static final Long TRIP_ID = 1L;
    private static final Long ITEM_ID = 10L;
    private static final String USER_EMAIL = "user@example.com";

    @Mock
    private TripRepository tripRepository;

    @Mock
    private PackingItemRepository packingItemRepository;

    @InjectMocks
    private PackingItemService packingItemService;

    private Trip trip;

    @BeforeEach
    void setUp() {
        trip = Trip.builder()
                .id(TRIP_ID)
                .build();
    }

    private void mockOwnedTrip() {
        when(tripRepository.findByIdAndUserEmail(TRIP_ID, USER_EMAIL))
                .thenReturn(Optional.of(trip));
    }

    private PackingItemRequest validRequest() {
        PackingItemRequest request = new PackingItemRequest();
        request.setName("Passport");
        request.setDescription("Keep it safely");
        request.setCategory(PackingCategory.DOCUMENTS);
        request.setQuantity(1);
        request.setPacked(false);
        return request;
    }

    private PackingItem sampleItem() {
        PackingItem item = new PackingItem();
        item.setId(ITEM_ID);
        item.setTrip(trip);
        item.setName("Passport");
        item.setDescription("Keep it safely");
        item.setCategory(PackingCategory.DOCUMENTS);
        item.setQuantity(1);
        item.setPacked(false);
        return item;
    }

    @Test
    void getPackingItemsReturnsItemsForOwnedTrip() {
        mockOwnedTrip();
        when(packingItemRepository.findByTripIdOrderByCreatedAtDesc(TRIP_ID))
                .thenReturn(List.of(sampleItem()));

        List<PackingItemResponse> result =
                packingItemService.getPackingItems(TRIP_ID, USER_EMAIL);

        assertEquals(1, result.size());
        assertEquals("Passport", result.get(0).getName());
        assertEquals(TRIP_ID, result.get(0).getTripId());
    }

    @Test
    void getPackingItemsRejectsTripNotOwnedByUser() {
        when(tripRepository.findByIdAndUserEmail(TRIP_ID, USER_EMAIL))
                .thenReturn(Optional.empty());

        assertThrows(
                TripNotFoundException.class,
                () -> packingItemService.getPackingItems(TRIP_ID, USER_EMAIL)
        );

        verifyNoInteractions(packingItemRepository);
    }

    @Test
    void createPackingItemSavesValidItem() {
        mockOwnedTrip();
        when(packingItemRepository.save(any(PackingItem.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        PackingItemResponse result = packingItemService.createPackingItem(
                TRIP_ID, validRequest(), USER_EMAIL
        );

        assertEquals("Passport", result.getName());
        assertEquals(PackingCategory.DOCUMENTS, result.getCategory());
        assertEquals(1, result.getQuantity());
        assertFalse(result.getPacked());

        verify(packingItemRepository).save(any(PackingItem.class));
    }

    @Test
    void createPackingItemRejectsBlankName() {
        mockOwnedTrip();

        PackingItemRequest request = validRequest();
        request.setName("   ");

        assertThrows(
                IllegalArgumentException.class,
                () -> packingItemService.createPackingItem(
                        TRIP_ID, request, USER_EMAIL
                )
        );

        verify(packingItemRepository, never()).save(any(PackingItem.class));
    }

    @Test
    void createPackingItemRejectsInvalidQuantity() {
        mockOwnedTrip();

        PackingItemRequest request = validRequest();
        request.setQuantity(0);

        assertThrows(
                IllegalArgumentException.class,
                () -> packingItemService.createPackingItem(
                        TRIP_ID, request, USER_EMAIL
                )
        );

        verify(packingItemRepository, never()).save(any(PackingItem.class));
    }

    @Test
    void updatePackedStatusChangesItemStatus() {
        mockOwnedTrip();

        PackingItem item = sampleItem();
        when(packingItemRepository.findByIdAndTripId(ITEM_ID, TRIP_ID))
                .thenReturn(Optional.of(item));
        when(packingItemRepository.save(any(PackingItem.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        PackingItemResponse result = packingItemService.updatePackedStatus(
                TRIP_ID, ITEM_ID, true, USER_EMAIL
        );

        assertTrue(result.getPacked());
        verify(packingItemRepository).save(item);
    }

    @Test
    void deletePackingItemDeletesExistingItem() {
        mockOwnedTrip();

        PackingItem item = sampleItem();
        when(packingItemRepository.findByIdAndTripId(ITEM_ID, TRIP_ID))
                .thenReturn(Optional.of(item));

        assertDoesNotThrow(
                () -> packingItemService.deletePackingItem(
                        TRIP_ID, ITEM_ID, USER_EMAIL
                )
        );

        verify(packingItemRepository).delete(item);
    }

    @Test
    void updatePackedStatusRejectsMissingItem() {
        mockOwnedTrip();
        when(packingItemRepository.findByIdAndTripId(ITEM_ID, TRIP_ID))
                .thenReturn(Optional.empty());

        assertThrows(
                PackingItemNotFoundException.class,
                () -> packingItemService.updatePackedStatus(
                        TRIP_ID, ITEM_ID, true, USER_EMAIL
                )
        );
    }

    @Test
    void getTotalItemsReturnsRepositoryCount() {
        mockOwnedTrip();
        when(packingItemRepository.countByTripId(TRIP_ID)).thenReturn(5L);

        assertEquals(5L, packingItemService.getTotalItems(TRIP_ID, USER_EMAIL));
    }

    @Test
    void getPackedItemsReturnsRepositoryCount() {
        mockOwnedTrip();
        when(packingItemRepository.countByTripIdAndPacked(TRIP_ID, true))
                .thenReturn(3L);

        assertEquals(3L, packingItemService.getPackedItems(TRIP_ID, USER_EMAIL));
    }
}