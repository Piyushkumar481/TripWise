CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_image_url VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    destination_country VARCHAR(100),
    destination_city VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'PLANNED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_trip_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    expense_date DATE,
    description TEXT,

    CONSTRAINT fk_expense_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE
);

CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_document_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE
);

CREATE TABLE notes (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    title VARCHAR(150),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_note_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE
);

CREATE TABLE checklist_items (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_checklist_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE
);