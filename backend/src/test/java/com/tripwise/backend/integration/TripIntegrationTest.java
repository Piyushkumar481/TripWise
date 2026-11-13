package com.tripwise.backend.integration;

import com.tripwise.backend.support.PostgresIntegrationTestBase;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.TripStatus;
import com.tripwise.backend.entity.User;
import com.tripwise.backend.repository.TripRepository;
import com.tripwise.backend.repository.UserRepository;
import com.tripwise.backend.security.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TripIntegrationTest extends PostgresIntegrationTestBase {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String jwtSecret;

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    private User testUser;

    @BeforeEach
    void setUp() {

        tripRepository.deleteAll();
        userRepository.deleteAll();

        testUser = User.builder()
                .fullName("Test User")
                .email("test@example.com")
                .password(
                        passwordEncoder.encode(
                                "Password@123"
                        )
                )
                .phone("9999999999")
                .emailVerified(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        testUser = userRepository.save(testUser);
    }

    @Test
    void contextLoads() {
    }

    @Test
    void shouldRejectUnauthenticatedRequest() throws Exception {

        mockMvc.perform(
                get("/api/trips")
        )
        .andExpect(
                status().isUnauthorized()
        );
    }

    @Test
    void shouldRejectInvalidJwt() throws Exception {

        mockMvc.perform(
                get("/api/trips")
                        .header(
                                "Authorization",
                                "Bearer not-a-valid-jwt"
                        )
        )
        .andExpect(
                status().isUnauthorized()
        );
    }

    @Test
    void shouldRejectExpiredJwt() throws Exception {

        JwtService expiredTokenIssuer = new JwtService();
        ReflectionTestUtils.setField(
                expiredTokenIssuer,
                "secret",
                jwtSecret
        );
        ReflectionTestUtils.setField(
                expiredTokenIssuer,
                "expiration",
                -1000L
        );
        String expiredToken =
                expiredTokenIssuer.generateToken(testUser.getEmail());

        mockMvc.perform(
                get("/api/trips")
                        .header(
                                "Authorization",
                                "Bearer " + expiredToken
                        )
        )
        .andExpect(
                status().isUnauthorized()
        );
    }

    @Test
    void shouldLoginSuccessfully() throws Exception {

        String loginRequest = """
                {
                    "email": "test@example.com",
                    "password": "Password@123"
                }
                """;

        String response =
                mockMvc.perform(
                post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(loginRequest)
        )
        .andExpect(
                status().isOk()
        )
        .andReturn()
        .getResponse()
        .getContentAsString();

        JsonNode loginRoot = objectMapper.readTree(response);
        assertNotNull(loginRoot.path("data").path("token").asText(null));
        assertNotNull(loginRoot.path("data").path("user").path("email").asText(null));
    }

    @Test
    void shouldRejectInvalidPassword() throws Exception {

        String loginRequest = """
                {
                    "email": "test@example.com",
                    "password": "WrongPassword"
                }
                """;

        mockMvc.perform(
                post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(loginRequest)
        )
        .andExpect(
                status().isUnauthorized()
        );
    }

    @Test
    void shouldRejectInvalidTripRequest() throws Exception {

        String loginRequest = """
                {
                    "email": "test@example.com",
                    "password": "Password@123"
                }
                """;

        String loginResponse =
                mockMvc.perform(
                        post("/api/auth/login")
                                .contentType(APPLICATION_JSON)
                                .content(loginRequest)
                )
                .andExpect(
                        status().isOk()
                )
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode loginRoot =
                objectMapper.readTree(loginResponse);

        JsonNode tokenNode =
                loginRoot.get("data")
                        .get("token");

        assertNotNull(tokenNode);

        String token =
                tokenNode.asText();

        String invalidRequest = """
                {
                    "title": "",
                    "destinationCountry": "",
                    "destinationCity": "",
                    "budget": -500
                }
                """;

        mockMvc.perform(
                post("/api/trips")
                        .header(
                                "Authorization",
                                "Bearer " + token
                        )
                        .contentType(APPLICATION_JSON)
                        .content(invalidRequest)
        )
        .andExpect(
                status().isBadRequest()
        );
    }

    @Test
    void shouldGetTripsWithValidJwt() throws Exception {

        Trip trip = Trip.builder()
                .user(testUser)
                .title("Hyderabad Integration Trip")
                .destinationCountry("India")
                .destinationCity("Hyderabad")
                .startDate(
                        LocalDate.now().plusDays(10)
                )
                .endDate(
                        LocalDate.now().plusDays(15)
                )
                .budget(
                        BigDecimal.valueOf(15000)
                )
                .status(TripStatus.PLANNED)
                .createdAt(LocalDateTime.now())
                .build();

        tripRepository.save(trip);

        String loginRequest = """
                {
                    "email": "test@example.com",
                    "password": "Password@123"
                }
                """;

        String loginResponse =
                mockMvc.perform(
                        post("/api/auth/login")
                                .contentType(APPLICATION_JSON)
                                .content(loginRequest)
                )
                .andExpect(
                        status().isOk()
                )
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode root =
                objectMapper.readTree(loginResponse);

        JsonNode tokenNode =
                root.get("data")
                        .get("token");

        assertNotNull(tokenNode);

        String token =
                tokenNode.asText();

        mockMvc.perform(
                get("/api/trips")
                        .header(
                                "Authorization",
                                "Bearer " + token
                        )
        )
        .andExpect(
                status().isOk()
        );
    }

    @Test
    void shouldNotAccessAnotherUsersTrip() throws Exception {

        User anotherUser = User.builder()
                .fullName("Another User")
                .email("another@example.com")
                .password(
                        passwordEncoder.encode(
                                "Password@123"
                        )
                )
                .phone("8888888888")
                .emailVerified(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        anotherUser =
                userRepository.save(anotherUser);

        Trip anotherUsersTrip =
                Trip.builder()
                        .user(anotherUser)
                        .title("Another User Trip")
                        .destinationCountry("India")
                        .destinationCity("Delhi")
                        .startDate(
                                LocalDate.now().plusDays(20)
                        )
                        .endDate(
                                LocalDate.now().plusDays(25)
                        )
                        .budget(
                                BigDecimal.valueOf(20000)
                        )
                        .status(TripStatus.PLANNED)
                        .createdAt(LocalDateTime.now())
                        .build();

        anotherUsersTrip =
                tripRepository.save(anotherUsersTrip);

        String loginRequest = """
                {
                    "email": "test@example.com",
                    "password": "Password@123"
                }
                """;

        String loginResponse =
                mockMvc.perform(
                        post("/api/auth/login")
                                .contentType(APPLICATION_JSON)
                                .content(loginRequest)
                )
                .andExpect(
                        status().isOk()
                )
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode root =
                objectMapper.readTree(loginResponse);

        JsonNode tokenNode =
                root.get("data")
                        .get("token");

        assertNotNull(tokenNode);

        String token =
                tokenNode.asText();

        mockMvc.perform(
                get(
                        "/api/trips/"
                                + anotherUsersTrip.getId()
                )
                .header(
                        "Authorization",
                        "Bearer " + token
                )
        )
        .andExpect(
                status().isNotFound()
        );
    }
}
