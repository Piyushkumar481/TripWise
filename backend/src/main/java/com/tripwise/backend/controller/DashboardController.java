package com.tripwise.backend.controller;

import com.tripwise.backend.dto.ApiResponse;
import com.tripwise.backend.dto.DashboardResponse;
import com.tripwise.backend.service.interfaces.DashboardService;

import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(
        name = "Dashboard",
        description = "TripWise dashboard APIs"
)
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>>
    getDashboard(
            Authentication authentication) {

        DashboardResponse dashboard =
                dashboardService.getDashboard(
                        authentication.getName()
                );

        ApiResponse<DashboardResponse> response =
                ApiResponse.<DashboardResponse>builder()
                        .success(true)
                        .message(
                                "Dashboard retrieved successfully."
                        )
                        .data(dashboard)
                        .timestamp(LocalDateTime.now())
                        .build();

        return ResponseEntity.ok(response);
    }
}