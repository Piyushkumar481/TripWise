package com.tripwise.testsupport;

import com.tripwise.backend.config.OpenApiConfig;
import com.tripwise.backend.config.SecurityConfig;
import com.tripwise.backend.security.CustomUserDetailsService;
import com.tripwise.backend.security.JwtAuthenticationEntryPoint;
import com.tripwise.backend.security.JwtAuthenticationFilter;
import com.tripwise.backend.security.JwtService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootConfiguration
@EnableAutoConfiguration(excludeName = {
        "org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration",
        "org.springframework.boot.hibernate.autoconfigure.HibernateJpaAutoConfiguration",
        "org.springframework.boot.flyway.autoconfigure.FlywayAutoConfiguration"
})
@Import({
        OpenApiConfig.class,
        SecurityConfig.class,
        ProfileTestAiEndpoint.class
})
class OpenApiProfileTestApplication {

    @Bean
    JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(
                Mockito.mock(JwtService.class),
                Mockito.mock(CustomUserDetailsService.class)
        );
    }

    @Bean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return new JwtAuthenticationEntryPoint();
    }
}

@RestController
class ProfileTestAiEndpoint {

    @GetMapping("/api/ai/test")
    String testAI() {
        return "ok";
    }
}

@SpringBootTest(classes = OpenApiProfileTestApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class OpenApiDevelopmentProfileTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void exposesOpenApiAndSwaggerUi() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/ai/test"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void allowsAuthenticatedAiTestEndpointInDevelopment()
            throws Exception {
        mockMvc.perform(get("/api/ai/test"))
                .andExpect(status().isOk());
    }
}

@SpringBootTest(
        classes = OpenApiProfileTestApplication.class,
        properties = {
                "spring.ai.google.genai.api-key=test-api-key",
                "jwt.secret=TripWiseDefaultProfileTestSecretKey123456789",
                "jwt.expiration=60000"
        }
)
@AutoConfigureMockMvc
class OpenApiDefaultProfileTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private Environment environment;

    @Test
    @WithMockUser
    void doesNotActivateDevelopmentProfileOrExposeSwaggerByDefault()
            throws Exception {
        assertFalse(environment.acceptsProfiles(Profiles.of("dev")));

        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isForbidden());
    }
}

@SpringBootTest(classes = OpenApiProfileTestApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("prod")
class OpenApiProductionProfileTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private Environment environment;

    @Test
    @WithMockUser
    void disablesOpenApiAndSwaggerUi() throws Exception {
        assertEquals("false", environment.getProperty("springdoc.api-docs.enabled"));
        assertEquals("false", environment.getProperty("springdoc.swagger-ui.enabled"));

        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/ai/test"))
                .andExpect(status().isForbidden());
    }
}

@SpringBootTest(
        classes = OpenApiProfileTestApplication.class,
        properties = {
                "springdoc.api-docs.enabled=true",
                "springdoc.swagger-ui.enabled=true"
        }
)
@AutoConfigureMockMvc
@ActiveProfiles("prod")
class OpenApiProductionOverrideProfileTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser
    void deniesSwaggerEvenWhenEnabledByOverride() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isForbidden());
    }
}
