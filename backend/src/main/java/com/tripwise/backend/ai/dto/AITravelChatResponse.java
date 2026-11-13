package com.tripwise.backend.ai.dto;

public class AITravelChatResponse {

    private String answer;

    public AITravelChatResponse() {
    }

    public AITravelChatResponse(String answer) {
        this.answer = answer;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}