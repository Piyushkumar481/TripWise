package com.tripwise.backend.exception;

public class AIOutputLimitExceededException extends RuntimeException {

    public AIOutputLimitExceededException() {
        super(
                "The AI response exceeded its configured output limit. "
                        + "Please try a shorter request."
        );
    }
}
