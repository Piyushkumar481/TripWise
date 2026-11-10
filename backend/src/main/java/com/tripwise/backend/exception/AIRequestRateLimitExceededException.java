package com.tripwise.backend.exception;

public class AIRequestRateLimitExceededException extends RuntimeException {

    private final long retryAfterSeconds;

    public AIRequestRateLimitExceededException(long retryAfterSeconds) {
        super("AI request limit exceeded. Please try again later.");
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public long getRetryAfterSeconds() {
        return retryAfterSeconds;
    }
}
