package com.tripwise.backend.validation;

import com.tripwise.backend.dto.TripRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class TripDateValidator
        implements ConstraintValidator<ValidTripDates, TripRequest> {

    @Override
    public boolean isValid(
            TripRequest request,
            ConstraintValidatorContext context) {

        if (request == null) {
            return true;
        }

        if (request.getStartDate() == null
                || request.getEndDate() == null) {
            return true;
        }

        return !request.getEndDate()
                .isBefore(request.getStartDate());
    }
}
