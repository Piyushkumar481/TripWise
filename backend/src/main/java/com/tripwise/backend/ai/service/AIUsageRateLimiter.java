package com.tripwise.backend.ai.service;

import com.tripwise.backend.config.AIProtectionProperties;
import com.tripwise.backend.exception.AIRequestRateLimitExceededException;
import com.tripwise.backend.exception.AIUsageLimitStoreUnavailableException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionException;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

@Slf4j
@Service
public class AIUsageRateLimiter {

    private static final String INSERT_COUNTER = """
            INSERT INTO ai_usage_counters (
                user_id,
                window_started_at,
                window_call_count,
                usage_day,
                daily_call_count
            )
            SELECT id, clock_timestamp(), 0,
                   (clock_timestamp() AT TIME ZONE 'UTC')::date, 0
            FROM users
            WHERE email = ?
            ON CONFLICT (user_id) DO NOTHING
            """;

    private static final String LOCK_COUNTER = """
            SELECT counter.window_started_at,
                   counter.window_call_count,
                   counter.usage_day,
                   counter.daily_call_count
            FROM ai_usage_counters counter
            WHERE counter.user_id = ?
            FOR UPDATE OF counter
            """;

    private static final String DATABASE_CLOCK = """
            SELECT clock.current_instant,
                   (clock.current_instant AT TIME ZONE 'UTC')::date
                       AS current_utc_day
            FROM (SELECT clock_timestamp() AS current_instant) clock
            """;

    private static final String UPDATE_COUNTER = """
            UPDATE ai_usage_counters
            SET window_started_at = ?,
                window_call_count = ?,
                usage_day = ?,
                daily_call_count = ?
            WHERE user_id = ?
            """;

    private static final RowMapper<UsageCounter> COUNTER_ROW_MAPPER =
            AIUsageRateLimiter::mapCounter;

    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;
    private final AIProtectionProperties properties;

    public AIUsageRateLimiter(
            JdbcTemplate jdbcTemplate,
            PlatformTransactionManager transactionManager,
            AIProtectionProperties properties) {

        this.jdbcTemplate = jdbcTemplate;
        this.transactionTemplate =
                new TransactionTemplate(transactionManager);
        this.transactionTemplate.setPropagationBehavior(
                TransactionDefinition.PROPAGATION_REQUIRES_NEW
        );
        this.properties = properties;
    }

    public void consume(String authenticatedUserEmail) {
        try {
            transactionTemplate.executeWithoutResult(
                    status -> consumeWithinTransaction(authenticatedUserEmail)
            );
        } catch (DataAccessException | TransactionException exception) {
            log.error("AI usage counter database operation failed", exception);
            throw new AIUsageLimitStoreUnavailableException();
        }
    }

    private void consumeWithinTransaction(String authenticatedUserEmail) {
        Long userId = jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE email = ?",
                Long.class,
                authenticatedUserEmail
        );

        if (userId == null) {
            throw new AIUsageLimitStoreUnavailableException();
        }

        jdbcTemplate.update(INSERT_COUNTER, authenticatedUserEmail);

        UsageCounter counter = jdbcTemplate.queryForObject(
                LOCK_COUNTER,
                COUNTER_ROW_MAPPER,
                userId
        );

        if (counter == null) {
            throw new AIUsageLimitStoreUnavailableException();
        }

        DatabaseClock databaseClock = jdbcTemplate.queryForObject(
                DATABASE_CLOCK,
                (resultSet, rowNumber) -> new DatabaseClock(
                        resultSet.getObject(
                                "current_instant",
                                java.time.OffsetDateTime.class
                        ).toInstant(),
                        resultSet.getDate("current_utc_day").toLocalDate()
                )
        );

        if (databaseClock == null) {
            throw new AIUsageLimitStoreUnavailableException();
        }

        Instant windowStartedAt = counter.windowStartedAt();
        int windowCalls = counter.windowCallCount();
        if (!windowStartedAt.plusSeconds(
                properties.getRateLimit().getWindowSeconds()
        ).isAfter(databaseClock.currentInstant())) {
            windowStartedAt = databaseClock.currentInstant();
            windowCalls = 0;
        }

        LocalDate usageDay = counter.usageDay();
        int dailyCalls = counter.dailyCallCount();
        if (!usageDay.equals(databaseClock.currentUtcDay())) {
            usageDay = databaseClock.currentUtcDay();
            dailyCalls = 0;
        }

        boolean windowExceeded =
                windowCalls >= properties.getRateLimit().getCallsPerWindow();
        boolean dailyExceeded =
                dailyCalls >= properties.getRateLimit().getCallsPerDay();

        if (windowExceeded || dailyExceeded) {
            long retryAfterSeconds = 0;

            if (windowExceeded) {
                retryAfterSeconds = secondsUntil(
                        windowStartedAt.plusSeconds(
                                properties.getRateLimit().getWindowSeconds()
                        ),
                        databaseClock.currentInstant()
                );
            }

            if (dailyExceeded) {
                Instant nextUtcDay = usageDay
                        .plusDays(1)
                        .atStartOfDay()
                        .toInstant(ZoneOffset.UTC);
                retryAfterSeconds = Math.max(
                        retryAfterSeconds,
                        secondsUntil(nextUtcDay, databaseClock.currentInstant())
                );
            }

            throw new AIRequestRateLimitExceededException(
                    Math.max(1, retryAfterSeconds)
            );
        }

        jdbcTemplate.update(
                UPDATE_COUNTER,
                java.sql.Timestamp.from(windowStartedAt),
                windowCalls + 1,
                Date.valueOf(usageDay),
                dailyCalls + 1,
                userId
        );
    }

    private static long secondsUntil(Instant deadline, Instant now) {
        Duration remaining = Duration.between(now, deadline);
        long seconds = remaining.getSeconds();
        return remaining.getNano() > 0 ? seconds + 1 : seconds;
    }

    private static UsageCounter mapCounter(
            ResultSet resultSet,
            int rowNumber) throws SQLException {

        return new UsageCounter(
                resultSet.getObject(
                        "window_started_at",
                        java.time.OffsetDateTime.class
                ).toInstant(),
                resultSet.getInt("window_call_count"),
                resultSet.getDate("usage_day").toLocalDate(),
                resultSet.getInt("daily_call_count")
        );
    }

    private record UsageCounter(
            Instant windowStartedAt,
            int windowCallCount,
            LocalDate usageDay,
            int dailyCallCount) {
    }

    private record DatabaseClock(
            Instant currentInstant,
            LocalDate currentUtcDay) {
    }
}
