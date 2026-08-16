package com.tripwise.backend.exception;

public class InvalidTripDateException extends RuntimeException {

    public InvalidTripDateException(String message) {
        super(message);
    }
}