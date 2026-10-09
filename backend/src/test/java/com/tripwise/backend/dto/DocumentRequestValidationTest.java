package com.tripwise.backend.dto;

import com.tripwise.backend.entity.DocumentCategory;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DocumentRequestValidationTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        if (factory != null) {
            factory.close();
        }
    }

    @Test
    void validDocumentRequestShouldPass() {
        DocumentRequest request = new DocumentRequest();
        request.setTitle("Flight Ticket");
        request.setDescription("Return flight booking");
        request.setCategory(DocumentCategory.FLIGHTS);

        assertTrue(validator.validate(request).isEmpty());
    }

    @Test
    void blankTitleShouldFail() {
        DocumentRequest request = new DocumentRequest();
        request.setTitle(" ");
        request.setCategory(DocumentCategory.FLIGHTS);

        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void missingCategoryShouldFail() {
        DocumentRequest request = new DocumentRequest();
        request.setTitle("Flight Ticket");

        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void titleLongerThan150CharactersShouldFail() {
        DocumentRequest request = new DocumentRequest();
        request.setTitle("A".repeat(151));
        request.setCategory(DocumentCategory.FLIGHTS);

        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void descriptionLongerThan500CharactersShouldFail() {
        DocumentRequest request = new DocumentRequest();
        request.setTitle("Flight Ticket");
        request.setDescription("A".repeat(501));
        request.setCategory(DocumentCategory.FLIGHTS);

        assertFalse(validator.validate(request).isEmpty());
    }
}
