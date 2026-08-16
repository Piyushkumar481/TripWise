package com.tripwise.backend.exception;

public class TripNotFoundException extends RuntimeException {

    public TripNotFoundException(String message) {
        super(message);
    }
}