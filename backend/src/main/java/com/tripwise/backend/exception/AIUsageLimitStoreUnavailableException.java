package com.tripwise.backend.exception;

public class AIUsageLimitStoreUnavailableException extends RuntimeException {

    public AIUsageLimitStoreUnavailableException() {
        super("AI usage limits are temporarily unavailable.");
    }
}
