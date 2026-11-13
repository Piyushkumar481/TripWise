CREATE TABLE ai_itineraries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    destination VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL,
    budget NUMERIC(12, 2) NOT NULL,
    travelers INTEGER NOT NULL,
    request_json TEXT NOT NULL,
    response_json TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_itineraries_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_ai_itinerary_duration
        CHECK (duration BETWEEN 1 AND 30),

    CONSTRAINT chk_ai_itinerary_budget
        CHECK (budget > 0),

    CONSTRAINT chk_ai_itinerary_travelers
        CHECK (travelers BETWEEN 1 AND 20)
);

CREATE INDEX idx_ai_itineraries_user_created
ON ai_itineraries(user_id, created_at DESC);