-- ============================================================
-- TripWise Initial Database Schema
-- Flyway Migration V1
-- ============================================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_image_url VARCHAR(255),
    email_verified BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE trips (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    destination_country VARCHAR(100),
    destination_city VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget NUMERIC(12, 2),
    status VARCHAR(20),

    CONSTRAINT fk_trips_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);

CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    expense_date DATE,
    description TEXT,

    CONSTRAINT fk_expenses_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(id)
);

CREATE TABLE itinerary_items (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    activity_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    category VARCHAR(30) NOT NULL,
    location VARCHAR(200),
    notes TEXT,
    display_order INTEGER,

    CONSTRAINT fk_itinerary_items_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(id)
);

CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    stored_file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    document_type VARCHAR(30) NOT NULL,
    created_at TIMESTAMP,

    CONSTRAINT fk_documents_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(id)
);

CREATE INDEX idx_trips_user_id
    ON trips(user_id);

CREATE INDEX idx_expenses_trip_id
    ON expenses(trip_id);

CREATE INDEX idx_itinerary_items_trip_id
    ON itinerary_items(trip_id);

CREATE INDEX idx_documents_trip_id
    ON documents(trip_id);

CREATE INDEX idx_users_email
    ON users(email);
