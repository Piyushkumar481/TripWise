package com.tripwise.backend.service;

import com.tripwise.backend.dto.ExpenseRequest;
import com.tripwise.backend.dto.ExpenseResponse;
import com.tripwise.backend.entity.Expense;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.exception.ExpenseNotFoundException;
import com.tripwise.backend.exception.InvalidTripDateException;
import com.tripwise.backend.exception.TripNotFoundException;
import com.tripwise.backend.repository.ExpenseRepository;
import com.tripwise.backend.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpenses(
            Long tripId,
            String userEmail) {

        Trip trip = getOwnedTrip(tripId, userEmail);

        return expenseRepository
                .findByTripIdOrderByDateAsc(trip.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ExpenseResponse createExpense(
            Long tripId,
            ExpenseRequest request,
            String userEmail) {

        Trip trip = getOwnedTrip(tripId, userEmail);

        validateDateBelongsToTrip(trip, request);

        Expense expense = Expense.builder()
                .trip(trip)
                .title(request.getTitle().trim())
                .amount(request.getAmount())
                .date(request.getDate())
                .category(request.getCategory().trim())
                .paymentMethod(normalize(request.getPaymentMethod()))
                .notes(normalize(request.getNotes()))
                .build();

        return toResponse(
                expenseRepository.save(expense)
        );
    }

    @Transactional
    public ExpenseResponse updateExpense(
            Long tripId,
            Long expenseId,
            ExpenseRequest request,
            String userEmail) {

        Trip trip = getOwnedTrip(tripId, userEmail);

        validateDateBelongsToTrip(trip, request);

        Expense expense = expenseRepository
                .findByIdAndTripId(expenseId, tripId)
                .orElseThrow(() ->
                        new ExpenseNotFoundException("Expense not found")
                );

        expense.setTitle(request.getTitle().trim());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());
        expense.setCategory(request.getCategory().trim());
        expense.setPaymentMethod(
                normalize(request.getPaymentMethod())
        );
        expense.setNotes(
                normalize(request.getNotes())
        );

        return toResponse(
                expenseRepository.save(expense)
        );
    }

    @Transactional
    public void deleteExpense(
            Long tripId,
            Long expenseId,
            String userEmail) {

        Trip trip = getOwnedTrip(tripId, userEmail);

        Expense expense = expenseRepository
                .findByIdAndTripId(expenseId, trip.getId())
                .orElseThrow(() ->
                        new ExpenseNotFoundException("Expense not found")
                );

        expenseRepository.delete(expense);
    }

    private Trip getOwnedTrip(
            Long tripId,
            String userEmail) {

        return tripRepository
                .findByIdAndUserEmail(
                        tripId,
                        userEmail
                )
                .orElseThrow(() ->
                        new TripNotFoundException(
                                "Trip not found"
                        )
                );
    }

    private void validateDateBelongsToTrip(
            Trip trip,
            ExpenseRequest request) {

        if (request.getDate().isBefore(trip.getStartDate())
                || request.getDate().isAfter(trip.getEndDate())) {

            throw new InvalidTripDateException(
                    "Expense date must be within the trip dates"
            );
        }
    }

    private String normalize(String value) {

        if (value == null) {
            return null;
        }

        String trimmed = value.trim();

        return trimmed.isEmpty()
                ? null
                : trimmed;
    }

    private ExpenseResponse toResponse(
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






