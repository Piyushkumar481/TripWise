package com.tripwise.backend.service.impl;

import com.tripwise.backend.dto.CreateExpenseRequest;
import com.tripwise.backend.dto.ExpenseResponse;
import com.tripwise.backend.dto.ExpenseSummaryResponse;
import com.tripwise.backend.entity.Expense;
import com.tripwise.backend.entity.ExpenseCategory;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.User;
import com.tripwise.backend.exception.InvalidCredentialsException;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.repository.ExpenseRepository;
import com.tripwise.backend.repository.TripRepository;
import com.tripwise.backend.repository.UserRepository;
import com.tripwise.backend.service.interfaces.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @Override
    public ExpenseResponse createExpense(
            String email,
            Long tripId,
            CreateExpenseRequest request) {

        Trip trip = getUserTrip(email, tripId);

        Expense expense = Expense.builder()
                .trip(trip)
                .category(request.getCategory())
                .amount(request.getAmount())
                .expenseDate(request.getExpenseDate())
                .description(request.getDescription())
                .build();

        Expense savedExpense = expenseRepository.save(expense);

        return mapToResponse(savedExpense);
    }

    @Override
    public List<ExpenseResponse> getExpenses(
            String email,
            Long tripId) {

        Trip trip = getUserTrip(email, tripId);

        return expenseRepository.findByTrip(trip)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ExpenseResponse getExpense(
            String email,
            Long tripId,
            Long expenseId) {

        Trip trip = getUserTrip(email, tripId);

        Expense expense = expenseRepository
                .findByIdAndTrip(expenseId, trip)
                .orElseThrow(() ->
                        new RuntimeException("Expense not found"));

        return mapToResponse(expense);
    }

    @Override
    public ExpenseResponse updateExpense(
            String email,
            Long tripId,
            Long expenseId,
            CreateExpenseRequest request) {

        Trip trip = getUserTrip(email, tripId);

        Expense expense = expenseRepository
                .findByIdAndTrip(expenseId, trip)
                .orElseThrow(() ->
                        new RuntimeException("Expense not found"));

        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());

        Expense updatedExpense = expenseRepository.save(expense);

        return mapToResponse(updatedExpense);
    }

    @Override
    public void deleteExpense(
            String email,
            Long tripId,
            Long expenseId) {

        Trip trip = getUserTrip(email, tripId);

        Expense expense = expenseRepository
                .findByIdAndTrip(expenseId, trip)
                .orElseThrow(() ->
                        new RuntimeException("Expense not found"));

        expenseRepository.delete(expense);
    }

    @Override
    public ExpenseSummaryResponse getExpenseSummary(
            String email,
            Long tripId) {

        Trip trip = getUserTrip(email, tripId);

        List<Expense> expenses =
                expenseRepository.findByTrip(trip);

        BigDecimal totalExpenses = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal budget =
                trip.getBudget() != null
                        ? trip.getBudget()
                        : BigDecimal.ZERO;

        BigDecimal remainingBudget =
                budget.subtract(totalExpenses);

        Map<ExpenseCategory, BigDecimal> categoryTotals =
                new EnumMap<>(ExpenseCategory.class);

        for (Expense expense : expenses) {
            categoryTotals.merge(
                    expense.getCategory(),
                    expense.getAmount(),
                    BigDecimal::add
            );
        }

        Map<String, BigDecimal> result =
                new java.util.LinkedHashMap<>();

        categoryTotals.forEach(
                (category, amount) ->
                        result.put(
                                category.name(),
                                amount
                        )
        );

        return ExpenseSummaryResponse.builder()
                .totalExpenses(totalExpenses)
                .tripBudget(budget)
                .remainingBudget(remainingBudget)
                .categoryTotals(result)
                .build();
    }

    private Trip getUserTrip(
            String email,
            Long tripId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "User not found"
                        ));

        return tripRepository
                .findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() ->
                        new TripNotFoundException(
                                "Trip not found"
                        ));
    }

    private ExpenseResponse mapToResponse(
            Expense expense) {

        return ExpenseResponse.builder()
                .id(expense.getId())
                .category(expense.getCategory())
                .amount(expense.getAmount())
                .expenseDate(expense.getExpenseDate())
                .description(expense.getDescription())
                .build();
    }
}