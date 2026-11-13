package com.tripwise.backend.exception;

public class AIQuotaExceededException extends RuntimeException {

    public AIQuotaExceededException() {
        super("TripWise AI daily quota has been exceeded. Please try again later.");
    }
}
