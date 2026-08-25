package com.tripwise.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardResponse {

    private long totalTrips;

    private long upcomingTrips;

    private long completedTrips;

    private BigDecimal totalBudget;

    private BigDecimal totalExpenses;

    private BigDecimal remainingBudget;

    private long countriesVisited;

    private List<RecentTripResponse> recentTrips;

    private Map<String, BigDecimal> expenseBreakdown;
}