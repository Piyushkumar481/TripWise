CREATE TABLE ai_usage_counters (
    user_id BIGINT PRIMARY KEY,
    window_started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    window_call_count INTEGER NOT NULL DEFAULT 0,
    usage_day DATE NOT NULL,
    daily_call_count INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT fk_ai_usage_counters_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_ai_usage_window_call_count
        CHECK (window_call_count >= 0),

    CONSTRAINT chk_ai_usage_daily_call_count
        CHECK (daily_call_count >= 0)
);
