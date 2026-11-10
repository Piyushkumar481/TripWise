package com.tripwise.backend.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Component
@Validated
@ConfigurationProperties(prefix = "tripwise.ai")
public class AIProtectionProperties {

    @Valid
    private RateLimit rateLimit = new RateLimit();

    @Valid
    private OutputTokens outputTokens = new OutputTokens();

    public RateLimit getRateLimit() {
        return rateLimit;
    }

    public void setRateLimit(RateLimit rateLimit) {
        this.rateLimit = rateLimit;
    }

    public OutputTokens getOutputTokens() {
        return outputTokens;
    }

    public void setOutputTokens(OutputTokens outputTokens) {
        this.outputTokens = outputTokens;
    }

    public static class RateLimit {

        @Min(1)
        private int callsPerWindow = 5;

        @Min(1)
        private int windowSeconds = 60;

        @Min(1)
        private int callsPerDay = 30;

        public int getCallsPerWindow() {
            return callsPerWindow;
        }

        public void setCallsPerWindow(int callsPerWindow) {
            this.callsPerWindow = callsPerWindow;
        }

        public int getWindowSeconds() {
            return windowSeconds;
        }

        public void setWindowSeconds(int windowSeconds) {
            this.windowSeconds = windowSeconds;
        }

        public int getCallsPerDay() {
            return callsPerDay;
        }

        public void setCallsPerDay(int callsPerDay) {
            this.callsPerDay = callsPerDay;
        }
    }

    public static class OutputTokens {

        @Min(1)
        private int itinerary = 8192;

        @Min(1)
        private int chat = 2048;

        @Min(1)
        private int recommendation = 2048;

        @Min(1)
        private int modification = 8192;

        @Min(1)
        private int budgetOptimization = 2048;

        @Min(1)
        private int diagnostic = 512;

        public int getItinerary() {
            return itinerary;
        }

        public void setItinerary(int itinerary) {
            this.itinerary = itinerary;
        }

        public int getChat() {
            return chat;
        }

        public void setChat(int chat) {
            this.chat = chat;
        }

        public int getRecommendation() {
            return recommendation;
        }

        public void setRecommendation(int recommendation) {
            this.recommendation = recommendation;
        }

        public int getModification() {
            return modification;
        }

        public void setModification(int modification) {
            this.modification = modification;
        }

        public int getBudgetOptimization() {
            return budgetOptimization;
        }

        public void setBudgetOptimization(int budgetOptimization) {
            this.budgetOptimization = budgetOptimization;
        }

        public int getDiagnostic() {
            return diagnostic;
        }

        public void setDiagnostic(int diagnostic) {
            this.diagnostic = diagnostic;
        }
    }
}
