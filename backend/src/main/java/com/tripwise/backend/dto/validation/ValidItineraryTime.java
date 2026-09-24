package com.tripwise.backend.dto.validation;

import com.tripwise.backend.dto.ItineraryRequest;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ItineraryTimeValidator.class)
@Documented
public @interface ValidItineraryTime {

    String message() default "End time must be after start time";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
