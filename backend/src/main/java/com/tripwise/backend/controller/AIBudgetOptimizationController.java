package com.tripwise.backend.controller;

import com.tripwise.backend.ai.dto.AIBudgetOptimizationRequest;
import com.tripwise.backend.ai.dto.AIBudgetOptimizationResponse;
import com.tripwise.backend.ai.service.AIBudgetOptimizationService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/itineraries")
public class AIBudgetOptimizationController {

    private final AIBudgetOptimizationService optimizationService;

    public AIBudgetOptimizationController(
            AIBudgetOptimizationService optimizationService) {

        this.optimizationService = optimizationService;
    }

    @PostMapping("/{itineraryId}/budget-optimization")
    public ResponseEntity<AIBudgetOptimizationResponse> optimizeBudget(
            @PathVariable Long itineraryId,
            @Valid @RequestBody AIBudgetOptimizationRequest request,
            Authentication authentication) {

        AIBudgetOptimizationResponse response =
                optimizationService.optimizeBudget(
                        itineraryId,
                        authentication.getName(),
                        request
                );

        return ResponseEntity.ok(response);
    }
}