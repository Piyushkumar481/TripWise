CREATE TABLE trip_notes (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_trip_notes_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_trip_notes_trip_id
    ON trip_notes(trip_id);

CREATE INDEX idx_trip_notes_trip_pinned_updated
    ON trip_notes(trip_id, pinned, updated_at DESC);