package com.tripwise.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TripDateValidator.class)
@Documented
public @interface ValidTripDates {

    String message() default "End date must be after or equal to start date";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
