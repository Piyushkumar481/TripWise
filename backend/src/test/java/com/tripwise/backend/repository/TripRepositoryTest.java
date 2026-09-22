package com.tripwise.backend.repository;

import com.tripwise.backend.entity.Trip;
import com.tripwise.backend.entity.User;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@Testcontainers
@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class TripRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16")
                    .withDatabaseName("tripwise_test")
                    .withUsername("test")
                    .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {

        registry.add(
                "spring.datasource.url",
                postgres::getJdbcUrl
        );

        registry.add(
                "spring.datasource.username",
                postgres::getUsername
        );

        registry.add(
                "spring.datasource.password",
                postgres::getPassword
        );
    }

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldSaveAndFindTrip() {

        User user = User.builder()
                .fullName("Test User")
                .email("test@example.com")
                .password("password")
                .emailVerified(false)
                .build();

        User savedUser = userRepository.save(user);

        Trip trip = Trip.builder()
                .user(savedUser)
                .title("Goa Trip")
                .destinationCountry("India")
                .destinationCity("Goa")
                .startDate(LocalDate.of(2026, 10, 1))
                .endDate(LocalDate.of(2026, 10, 5))
                .build();

        Trip savedTrip = tripRepository.save(trip);

        assertNotNull(savedTrip.getId());
        assertEquals("Goa Trip", savedTrip.getTitle());

        Optional<Trip> found =
                tripRepository.findById(savedTrip.getId());

        assertTrue(found.isPresent());
        assertEquals("Goa Trip", found.get().getTitle());
    }
}
