package com.tripwise.backend.exception;

public class AIServiceUnavailableException extends RuntimeException {

    public AIServiceUnavailableException() {
        super("TripWise AI is temporarily experiencing high demand. Please try again in a few minutes. Your trip details are still available in this form.");
    }
}