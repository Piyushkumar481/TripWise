package com.tripwise.backend.exception;

public class ItineraryItemNotFoundException
        extends RuntimeException {

    public ItineraryItemNotFoundException(String message) {
        super(message);
    }
}