package com.tripwise.backend.ai.service;

import com.tripwise.backend.config.AIProtectionProperties;
import com.tripwise.backend.exception.AIOutputLimitExceededException;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.stereotype.Service;

@Service
public class AIProviderClient {

    private final ChatClient chatClient;
    private final AIUsageRateLimiter rateLimiter;
    private final AIProtectionProperties properties;

    public AIProviderClient(
            ChatClient chatClient,
            AIUsageRateLimiter rateLimiter,
            AIProtectionProperties properties) {
        this.chatClient = chatClient;
        this.rateLimiter = rateLimiter;
        this.properties = properties;
    }

    public String generateContent(
            String authenticatedUserEmail,
            String systemPrompt,
            String userPrompt,
            AIUseCase useCase) {

        ChatClient.CallResponseSpec response = invoke(
                authenticatedUserEmail,
                systemPrompt,
                userPrompt,
                useCase
        );

        return response.content();
    }

    public <T> T generateEntity(
            String authenticatedUserEmail,
            String systemPrompt,
            String userPrompt,
            AIUseCase useCase,
            Class<T> responseType) {

        ChatClient.CallResponseSpec response = invoke(
                authenticatedUserEmail,
                systemPrompt,
                userPrompt,
                useCase
        );

        return response.entity(responseType);
    }

    private ChatClient.CallResponseSpec invoke(
            String authenticatedUserEmail,
            String systemPrompt,
            String userPrompt,
            AIUseCase useCase) {

        rateLimiter.consume(authenticatedUserEmail);

        ChatClient.CallResponseSpec response = chatClient.prompt()
                .options(
                        GoogleGenAiChatOptions.builder()
                                .maxOutputTokens(outputTokenLimit(useCase))
                )
                .system(systemPrompt)
                .user(userPrompt)
                .call();

        ChatResponse chatResponse = response.chatResponse();
        if (chatResponse != null
                && chatResponse.getResult() != null
                && "MAX_TOKENS".equalsIgnoreCase(
                        chatResponse.getResult()
                                .getMetadata()
                                .getFinishReason()
                )) {
            throw new AIOutputLimitExceededException();
        }

        return response;
    }

    private int outputTokenLimit(AIUseCase useCase) {
        AIProtectionProperties.OutputTokens limits =
                properties.getOutputTokens();

        return switch (useCase) {
            case ITINERARY -> limits.getItinerary();
            case CHAT -> limits.getChat();
            case RECOMMENDATION -> limits.getRecommendation();
            case MODIFICATION -> limits.getModification();
            case BUDGET_OPTIMIZATION -> limits.getBudgetOptimization();
            case DIAGNOSTIC -> limits.getDiagnostic();
        };
    }
}
