package com.tripwise.backend.ai.service;

import com.tripwise.backend.config.AIProtectionProperties;
import com.tripwise.backend.exception.AIRequestRateLimitExceededException;
import com.tripwise.backend.exception.AIUsageLimitStoreUnavailableException;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;

@Testcontainers(disabledWithoutDocker = true)
class AIUsageRateLimiterIntegrationTest {

    private static final String USER_EMAIL = "rate-limit@example.com";

    @Container
    private static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16")
                    .withDatabaseName("tripwise_rate_limit")
                    .withUsername("test")
                    .withPassword("test");

    private static DataSource dataSource;
    private static JdbcTemplate jdbcTemplate;
    private static AIProtectionProperties properties;
    private static AIUsageRateLimiter rateLimiter;

    @BeforeAll
    static void migrateDisposableDatabase() {
        DriverManagerDataSource source = new DriverManagerDataSource(
                POSTGRES.getJdbcUrl(),
                POSTGRES.getUsername(),
                POSTGRES.getPassword()
        );
        dataSource = source;

        Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .load()
                .migrate();

        jdbcTemplate = new JdbcTemplate(dataSource);
        properties = new AIProtectionProperties();
        rateLimiter = new AIUsageRateLimiter(
                jdbcTemplate,
                new DataSourceTransactionManager(dataSource),
                properties
        );
    }

    @AfterAll
    static void closeDataSource() throws Exception {
        if (dataSource instanceof AutoCloseable closeable) {
            closeable.close();
        }
    }

    @BeforeEach
    void createFreshUser() {
        jdbcTemplate.update("DELETE FROM users");
        jdbcTemplate.update(
                """
                INSERT INTO users (full_name, email, password)
                VALUES (?, ?, ?)
                """,
                "Rate Limit User",
                USER_EMAIL,
                "not-a-real-password"
        );
    }

    @Test
    void concurrentFirstRequestsCreateOneCounterAndAdmitOnlyWindowLimit()
            throws Exception {

        List<Boolean> outcomes = runConcurrentRequests(16);

        assertEquals(5, outcomes.stream().filter(Boolean::booleanValue).count());
        assertEquals(
                1,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM ai_usage_counters",
                        Integer.class
                )
        );
        assertEquals(5, counterValue("window_call_count"));
        assertEquals(5, counterValue("daily_call_count"));
    }

    @Test
    void concurrentRequestsForExistingUserSerializeOnCounterRow()
            throws Exception {

        rateLimiter.consume(USER_EMAIL);
        List<Boolean> outcomes = runConcurrentRequests(16);

        assertEquals(4, outcomes.stream().filter(Boolean::booleanValue).count());
        assertEquals(5, counterValue("window_call_count"));
        assertEquals(5, counterValue("daily_call_count"));
    }

    @Test
    void enforcesShortWindowLimitAndProvidesRetryTime() {
        for (int i = 0; i < properties.getRateLimit().getCallsPerWindow(); i++) {
            rateLimiter.consume(USER_EMAIL);
        }

        AIRequestRateLimitExceededException exception = assertThrows(
                AIRequestRateLimitExceededException.class,
                () -> rateLimiter.consume(USER_EMAIL)
        );

        assertFalse(exception.getRetryAfterSeconds() < 1);
        assertEquals(5, counterValue("window_call_count"));
    }

    @Test
    void requestWaitingPastWindowDeadlineIsAdmitted() throws Exception {
        rateLimiter.consume(USER_EMAIL);
        jdbcTemplate.update(
                """
                UPDATE ai_usage_counters
                SET window_started_at = clock_timestamp() - INTERVAL '59 seconds',
                    window_call_count = ?
                WHERE user_id = (SELECT id FROM users WHERE email = ?)
                """,
                properties.getRateLimit().getCallsPerWindow(),
                USER_EMAIL
        );

        ExecutorService executor = Executors.newSingleThreadExecutor();
        try (Connection blocker = lockUserCounter()) {
            Future<Boolean> request = executor.submit(() -> {
                try {
                    rateLimiter.consume(USER_EMAIL);
                    return true;
                } catch (AIRequestRateLimitExceededException exception) {
                    return false;
                }
            });

            awaitCounterLockWait();
            Thread.sleep(1_500);
            blocker.commit();

            assertTrue(request.get(10, TimeUnit.SECONDS));
            assertEquals(1, counterValue("window_call_count"));
        } finally {
            executor.shutdownNow();
        }
    }

    @Test
    void dailyRetryAfterUsesTimeSampledAfterCounterLockWait() throws Exception {
        rateLimiter.consume(USER_EMAIL);
        jdbcTemplate.update(
                """
                UPDATE ai_usage_counters
                SET daily_call_count = ?
                WHERE user_id = (SELECT id FROM users WHERE email = ?)
                """,
                properties.getRateLimit().getCallsPerDay(),
                USER_EMAIL
        );

        ExecutorService executor = Executors.newSingleThreadExecutor();
        try (Connection blocker = lockUserCounter()) {
            Future<Long> request = executor.submit(() -> {
                try {
                    rateLimiter.consume(USER_EMAIL);
                    throw new AssertionError("Expected the daily limit to reject the request");
                } catch (AIRequestRateLimitExceededException exception) {
                    return exception.getRetryAfterSeconds();
                }
            });

            awaitCounterLockWait();
            long retryAfterBeforeWait = secondsUntilNextUtcDay();
            Thread.sleep(2_200);
            blocker.commit();

            long retryAfter = request.get(10, TimeUnit.SECONDS);
            assertTrue(retryAfter < retryAfterBeforeWait);
            assertEquals(
                    properties.getRateLimit().getCallsPerDay(),
                    counterValue("daily_call_count")
            );
        } finally {
            executor.shutdownNow();
        }
    }

    @Test
    void requestWaitingAcrossUtcDayRolloverResetsDailyQuota() throws Exception {
        rateLimiter.consume(USER_EMAIL);
        jdbcTemplate.update(
                """
                UPDATE ai_usage_counters SET daily_call_count = ?
                WHERE user_id = (SELECT id FROM users WHERE email = ?)
                """,
                properties.getRateLimit().getCallsPerDay(),
                USER_EMAIL
        );

        ExecutorService executor = Executors.newSingleThreadExecutor();
        try (Connection blocker = lockUserCounter()) {
            Future<Boolean> request = executor.submit(() -> {
                try {
                    rateLimiter.consume(USER_EMAIL);
                    return true;
                } catch (AIRequestRateLimitExceededException exception) {
                    return false;
                }
            });

            awaitCounterLockWait();
            try (PreparedStatement rollover = blocker.prepareStatement(
                    """
                    UPDATE ai_usage_counters
                    SET usage_day = (clock_timestamp() AT TIME ZONE 'UTC')::date - 1
                    WHERE user_id = (SELECT id FROM users WHERE email = ?)
                    """)) {
                rollover.setString(1, USER_EMAIL);
                rollover.executeUpdate();
            }
            blocker.commit();

            assertTrue(request.get(10, TimeUnit.SECONDS));
            assertEquals(1, counterValue("daily_call_count"));
        } finally {
            executor.shutdownNow();
        }
    }

    @Test
    void enforcesDailyLimitWithoutConsumingAnotherCall() {
        rateLimiter.consume(USER_EMAIL);
        jdbcTemplate.update(
                """
                UPDATE ai_usage_counters
                SET daily_call_count = ?
                WHERE user_id = (SELECT id FROM users WHERE email = ?)
                """,
                properties.getRateLimit().getCallsPerDay(),
                USER_EMAIL
        );

        assertThrows(
                AIRequestRateLimitExceededException.class,
                () -> rateLimiter.consume(USER_EMAIL)
        );
        assertEquals(1, counterValue("window_call_count"));
        assertEquals(30, counterValue("daily_call_count"));
    }

    @Test
    void resetsDailyCounterAtUtcDateBoundary() {
        rateLimiter.consume(USER_EMAIL);
        jdbcTemplate.update(
                """
                UPDATE ai_usage_counters
                SET usage_day =
                        (clock_timestamp() AT TIME ZONE 'UTC')::date - 1,
                    daily_call_count = ?
                WHERE user_id = (SELECT id FROM users WHERE email = ?)
                """,
                properties.getRateLimit().getCallsPerDay(),
                USER_EMAIL
        );

        rateLimiter.consume(USER_EMAIL);

        LocalDate usageDay = jdbcTemplate.queryForObject(
                """
                SELECT usage_day FROM ai_usage_counters
                WHERE user_id = (SELECT id FROM users WHERE email = ?)
                """,
                LocalDate.class,
                USER_EMAIL
        );
        LocalDate currentUtcDay = jdbcTemplate.queryForObject(
                "SELECT (clock_timestamp() AT TIME ZONE 'UTC')::date",
                LocalDate.class
        );

        assertEquals(currentUtcDay, usageDay);
        assertEquals(1, counterValue("daily_call_count"));
    }

    @Test
    void sanitizesDatabaseOperationFailures() {
        JdbcTemplate failingJdbcTemplate = mock(JdbcTemplate.class);
        doThrow(new DataAccessResourceFailureException(
                "database password and SQL details"
        )).when(failingJdbcTemplate).queryForObject(
                eq("SELECT id FROM users WHERE email = ?"),
                eq(Long.class),
                eq(USER_EMAIL)
        );

        AIUsageRateLimiter failingLimiter = new AIUsageRateLimiter(
                failingJdbcTemplate,
                new DataSourceTransactionManager(dataSource),
                properties
        );

        AIUsageLimitStoreUnavailableException exception = assertThrows(
                AIUsageLimitStoreUnavailableException.class,
                () -> failingLimiter.consume(USER_EMAIL)
        );

        assertFalse(exception.getMessage().contains("password"));
        assertFalse(exception.getMessage().contains("SQL"));
    }

    private List<Boolean> runConcurrentRequests(int requestCount)
            throws Exception {

        ExecutorService executor = Executors.newFixedThreadPool(requestCount);
        CountDownLatch ready = new CountDownLatch(requestCount);
        CountDownLatch start = new CountDownLatch(1);
        List<Future<Boolean>> futures = new ArrayList<>();

        try {
            for (int i = 0; i < requestCount; i++) {
                futures.add(executor.submit(() -> {
                    ready.countDown();
                    start.await();
                    try {
                        rateLimiter.consume(USER_EMAIL);
                        return true;
                    } catch (AIRequestRateLimitExceededException exception) {
                        return false;
                    }
                }));
            }

            ready.await();
            start.countDown();

            List<Boolean> outcomes = new ArrayList<>();
            for (Future<Boolean> future : futures) {
                outcomes.add(future.get());
            }
            return outcomes;
        } finally {
            executor.shutdownNow();
        }
    }

    private int counterValue(String column) {
        if (!List.of("window_call_count", "daily_call_count").contains(column)) {
            throw new IllegalArgumentException("Unsupported counter column");
        }

        return jdbcTemplate.queryForObject(
                "SELECT " + column
                        + " FROM ai_usage_counters "
                        + "WHERE user_id = (SELECT id FROM users WHERE email = ?)",
                Integer.class,
                USER_EMAIL
        );
    }

    private Connection lockUserCounter() throws SQLException {
        Connection connection = dataSource.getConnection();
        connection.setAutoCommit(false);
        try (PreparedStatement statement = connection.prepareStatement(
                """
                SELECT user_id FROM ai_usage_counters
                WHERE user_id = (SELECT id FROM users WHERE email = ?)
                FOR UPDATE
                """)) {
            statement.setString(1, USER_EMAIL);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    connection.close();
                    throw new IllegalStateException("Counter row was not created");
                }
            }
        }
        return connection;
    }

    private void awaitCounterLockWait() throws InterruptedException {
        long deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(10);
        while (System.nanoTime() < deadline) {
            Integer waiting = jdbcTemplate.queryForObject(
                    """
                    SELECT COUNT(*)
                    FROM pg_stat_activity
                    WHERE wait_event_type = 'Lock'
                      AND query LIKE '%FOR UPDATE OF counter%'
                    """,
                    Integer.class
            );
            if (waiting != null && waiting > 0) {
                return;
            }
            Thread.sleep(25);
        }
        throw new AssertionError("Rate-limit query did not wait for the counter lock");
    }

    private long secondsUntilNextUtcDay() {
        return jdbcTemplate.queryForObject(
                """
                SELECT CEIL(EXTRACT(EPOCH FROM (
                    ((date_trunc('day', clock.current_instant AT TIME ZONE 'UTC')
                        + INTERVAL '1 day') AT TIME ZONE 'UTC')
                    - clock.current_instant
                )))::bigint
                FROM (SELECT clock_timestamp() AS current_instant) clock
                """,
                Long.class
        );
    }
}
