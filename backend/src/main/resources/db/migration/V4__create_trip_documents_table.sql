CREATE TABLE trip_documents (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    original_file_name VARCHAR(255) NOT NULL,
    storage_key VARCHAR(500) NOT NULL UNIQUE,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_trip_documents_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_trip_documents_file_size
        CHECK (file_size > 0)
);

CREATE INDEX idx_trip_documents_trip_id
    ON trip_documents(trip_id);

CREATE INDEX idx_trip_documents_trip_uploaded
    ON trip_documents(trip_id, uploaded_at);
