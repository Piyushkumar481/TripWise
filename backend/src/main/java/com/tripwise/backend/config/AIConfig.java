package com.tripwise.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.genai.Client;
import com.google.genai.types.HttpOptions;
import com.google.genai.types.HttpRetryOptions;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.model.google.genai.autoconfigure.chat.GoogleGenAiConnectionProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class AIConfig {

    @Bean
    @Primary
    public Client rateLimitedGoogleGenAiClient(
            GoogleGenAiConnectionProperties properties) throws IOException {

        Client.Builder builder = Client.builder()
                .httpOptions(singleAttemptHttpOptions());

        boolean hasApiKey = StringUtils.hasText(properties.getApiKey());
        boolean hasProjectAndLocation =
                StringUtils.hasText(properties.getProjectId())
                        && StringUtils.hasText(properties.getLocation());

        if (properties.isVertexAi()
                || (!hasApiKey && hasProjectAndLocation)) {
            Assert.state(
                    hasProjectAndLocation,
                    "Vertex AI mode requires project-id and location."
            );
            builder.project(properties.getProjectId())
                    .location(properties.getLocation())
                    .vertexAI(true);

            if (properties.getCredentialsUri() != null) {
                try (InputStream credentials =
                             properties.getCredentialsUri().getInputStream()) {
                    builder.credentials(
                            GoogleCredentials.fromStream(credentials)
                    );
                }
            }
        } else if (hasApiKey) {
            builder.apiKey(properties.getApiKey());
        } else {
            throw new IllegalStateException(
                    "Configure a Google GenAI API key or Vertex AI project-id and location."
            );
        }

        return builder.build();
    }

    static HttpOptions singleAttemptHttpOptions() {
        return HttpOptions.builder()
                .retryOptions(HttpRetryOptions.builder()
                        .attempts(1)
                        .build())
                .build();
    }

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder.build();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper().findAndRegisterModules();
    }
}