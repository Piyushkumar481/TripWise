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
import java.util.LinkedHashMap;
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

        String category = request.getCategory().name();
        String notes = request.getDescription();

        Expense expense = Expense.builder()
                .trip(trip)
                .title(
                        notes != null && !notes.isBlank()
                                ? notes
                                : category
                )
                .amount(request.getAmount())
                .date(request.getExpenseDate())
                .category(category)
                .notes(notes)
                .build();

        Expense savedExpense = expenseRepository.save(expense);

        return mapToResponse(savedExpense);
    }

    @Override
    public List<ExpenseResponse> getExpenses(
            String email,
            Long tripId) {

        getUserTrip(email, tripId);

        return expenseRepository
                .findByTripIdOrderByDateAsc(tripId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ExpenseResponse getExpense(
            String email,
            Long tripId,
            Long expenseId) {

        getUserTrip(email, tripId);

        Expense expense = expenseRepository
                .findByIdAndTripId(expenseId, tripId)
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

        getUserTrip(email, tripId);

        Expense expense = expenseRepository
                .findByIdAndTripId(expenseId, tripId)
                .orElseThrow(() ->
                        new RuntimeException("Expense not found"));

        String category = request.getCategory().name();
        String notes = request.getDescription();

        expense.setTitle(
                notes != null && !notes.isBlank()
                        ? notes
                        : category
        );
        expense.setAmount(request.getAmount());
        expense.setDate(request.getExpenseDate());
        expense.setCategory(category);
        expense.setNotes(notes);

        Expense updatedExpense = expenseRepository.save(expense);

        return mapToResponse(updatedExpense);
    }

    @Override
    public void deleteExpense(
            String email,
            Long tripId,
            Long expenseId) {

        getUserTrip(email, tripId);

        Expense expense = expenseRepository
                .findByIdAndTripId(expenseId, tripId)
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
                expenseRepository.findByTripIdOrderByDateAsc(tripId);

        BigDecimal totalExpenses = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal budget =
                trip.getBudget() != null
                        ? trip.getBudget()
                        : BigDecimal.ZERO;

        BigDecimal remainingBudget =
                budget.subtract(totalExpenses);

        Map<String, BigDecimal> result =
                new LinkedHashMap<>();

        for (Expense expense : expenses) {
            result.merge(
                    expense.getCategory(),
                    expense.getAmount(),
                    BigDecimal::add
            );
        }

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
                .tripId(expense.getTrip().getId())
                .title(expense.getTitle())
                .amount(expense.getAmount())
                .date(expense.getDate())
                .category(expense.getCategory())
                .paymentMethod(expense.getPaymentMethod())
                .notes(expense.getNotes())
                .build();
    }
}

