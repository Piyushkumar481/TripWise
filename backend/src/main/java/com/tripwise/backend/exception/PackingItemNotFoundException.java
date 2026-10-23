package com.tripwise.backend.exception;

public class PackingItemNotFoundException extends RuntimeException {

    public PackingItemNotFoundException(String message) {
        super(message);
    }
}
