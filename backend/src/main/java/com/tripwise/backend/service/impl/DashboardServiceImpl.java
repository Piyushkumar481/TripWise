package com.tripwise.backend.service.impl;

import com.tripwise.backend.dto.DashboardResponse;
import com.tripwise.backend.dto.RecentTripResponse;
import com.tripwise.backend.entity.Expense;
import com.tripwise.backend.entity.ExpenseCategory;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.TripStatus;
import com.tripwise.backend.entity.User;
import com.tripwise.backend.exception.InvalidCredentialsException;
import com.tripwise.backend.repository.ExpenseRepository;
import com.tripwise.backend.repository.TripRepository;
import com.tripwise.backend.repository.UserRepository;
import com.tripwise.backend.service.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl
        implements DashboardService {

    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final ExpenseRepository expenseRepository;

    @Override
    public DashboardResponse getDashboard(
            String email) {

        User user = getUser(email);

        List<Trip> trips =
                tripRepository.findByUser(user);

        long totalTrips = trips.size();

        long upcomingTrips =
                trips.stream()
                        .filter(trip ->
                                trip.getStartDate()
                                        .isAfter(
                                                LocalDate.now()
                                        )
                                &&
                                trip.getStatus()
                                        != TripStatus.COMPLETED
                                &&
                                trip.getStatus()
                                        != TripStatus.ARCHIVED
                        )
                        .count();

        long completedTrips =
                trips.stream()
                        .filter(trip ->
                                trip.getStatus()
                                        == TripStatus.COMPLETED)
                        .count();

        BigDecimal totalBudget =
                trips.stream()
                        .map(trip ->
                                trip.getBudget() != null
                                        ? trip.getBudget()
                                        : BigDecimal.ZERO)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        List<Expense> expenses =
                trips.isEmpty()
                        ? List.of()
                        : expenseRepository.findByTripIn(trips);

        BigDecimal totalExpenses =
                expenses.stream()
                        .map(Expense::getAmount)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        BigDecimal remainingBudget =
                totalBudget.subtract(totalExpenses);

        long countriesVisited =
                trips.stream()
                        .map(Trip::getDestinationCountry)
                        .filter(country ->
                                country != null &&
                                !country.isBlank())
                        .distinct()
                        .count();

        Map<String, BigDecimal> expenseBreakdown =
                calculateExpenseBreakdown(expenses);

        List<RecentTripResponse> recentTrips =
                tripRepository
                        .findTop5ByUserOrderByCreatedAtDesc(user)
                        .stream()
                        .map(this::mapRecentTrip)
                        .toList();

        return DashboardResponse.builder()
                .totalTrips(totalTrips)
                .upcomingTrips(upcomingTrips)
                .completedTrips(completedTrips)
                .totalBudget(totalBudget)
                .totalExpenses(totalExpenses)
                .remainingBudget(remainingBudget)
                .countriesVisited(countriesVisited)
                .recentTrips(recentTrips)
                .expenseBreakdown(expenseBreakdown)
                .build();
    }

    private User getUser(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "User not found"
                        ));
    }

    private Map<String, BigDecimal>
    calculateExpenseBreakdown(
            List<Expense> expenses) {

        Map<ExpenseCategory, BigDecimal> totals =
                new EnumMap<>(ExpenseCategory.class);

        for (Expense expense : expenses) {

            totals.merge(
                    expense.getCategory(),
                    expense.getAmount(),
                    BigDecimal::add
            );
        }

        Map<String, BigDecimal> result =
                new LinkedHashMap<>();

        totals.forEach(
                (category, amount) ->
                        result.put(
                                category.name(),
                                amount
                        )
        );

        return result;
    }

    private RecentTripResponse mapRecentTrip(
            Trip trip) {

        return RecentTripResponse.builder()
                .id(trip.getId())
                .title(trip.getTitle())
                .destinationCountry(
                        trip.getDestinationCountry()
                )
                .destinationCity(
                        trip.getDestinationCity()
                )
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .status(
                        trip.getStatus() != null
                                ? trip.getStatus().name()
                                : null
                )
                .budget(trip.getBudget())
                .build();
    }
}