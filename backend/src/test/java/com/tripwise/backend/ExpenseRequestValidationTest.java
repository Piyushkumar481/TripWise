package com.tripwise.backend;

import com.tripwise.backend.dto.ExpenseRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ExpenseRequestValidationTest {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    static void setUp() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        validatorFactory.close();
    }

    private ExpenseRequest createValidRequest() {
        ExpenseRequest request = new ExpenseRequest();
        request.setTitle("Hotel Booking");
        request.setAmount(new BigDecimal("2500.00"));
        request.setDate(LocalDate.of(2026, 9, 29));
        request.setCategory("Accommodation");
        request.setPaymentMethod("UPI");
        request.setNotes("Hotel stay for two nights");
        return request;
    }

    @Test
    void shouldAcceptValidExpenseRequest() {
        ExpenseRequest request = createValidRequest();

        Set<ConstraintViolation<ExpenseRequest>> violations =
                validator.validate(request);

        assertTrue(violations.isEmpty());
    }

    @Test
    void shouldRejectMissingTitle() {
        ExpenseRequest request = createValidRequest();
        request.setTitle(null);

        Set<ConstraintViolation<ExpenseRequest>> violations =
                validator.validate(request);

        assertFalse(violations.isEmpty());
    }

    @Test
    void shouldRejectMissingAmount() {
        ExpenseRequest request = createValidRequest();
        request.setAmount(null);

        Set<ConstraintViolation<ExpenseRequest>> violations =
                validator.validate(request);

        assertFalse(violations.isEmpty());
    }

    @Test
    void shouldRejectZeroAmount() {
        ExpenseRequest request = createValidRequest();
        request.setAmount(BigDecimal.ZERO);

        Set<ConstraintViolation<ExpenseRequest>> violations =
                validator.validate(request);

        assertFalse(violations.isEmpty());
    }

    @Test
    void shouldRejectNegativeAmount() {
        ExpenseRequest request = createValidRequest();
        request.setAmount(new BigDecimal("-100.00"));

        Set<ConstraintViolation<ExpenseRequest>> violations =
                validator.validate(request);

        assertFalse(violations.isEmpty());
    }

    @Test
    void shouldRejectMissingDate() {
        ExpenseRequest request = createValidRequest();
        request.setDate(null);

        Set<ConstraintViolation<ExpenseRequest>> violations =
                validator.validate(request);

        assertFalse(violations.isEmpty());
    }

    @Test
    void shouldRejectMissingCategory() {
        ExpenseRequest request = createValidRequest();
        request.setCategory(null);

        Set<ConstraintViolation<ExpenseRequest>> violations =
                validator.validate(request);

        assertFalse(violations.isEmpty());
    }
}
