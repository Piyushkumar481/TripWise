package com.tripwise.backend.dto.validation;

import com.tripwise.backend.dto.ItineraryRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ItineraryTimeValidator
        implements ConstraintValidator<ValidItineraryTime, ItineraryRequest> {

    @Override
    public boolean isValid(
            ItineraryRequest request,
            ConstraintValidatorContext context) {

        if (request == null) {
            return true;
        }

        if (request.getStartTime() == null ||
                request.getEndTime() == null) {
            return true;
        }

        return request.getEndTime()
                .isAfter(request.getStartTime());
    }
}
