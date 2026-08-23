package com.tripwise.backend.exception;

public class InvalidItineraryException
        extends RuntimeException {

    public InvalidItineraryException(String message) {
        super(message);
    }
}