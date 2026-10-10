CREATE TABLE packing_items (
    id BIGSERIAL PRIMARY KEY,

    trip_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,

    description VARCHAR(500),

    category VARCHAR(50) NOT NULL,

    quantity INTEGER NOT NULL DEFAULT 1,

    packed BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_packing_items_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_packing_items_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_packing_items_category
        CHECK (
            category IN (
                'CLOTHING',
                'ELECTRONICS',
                'DOCUMENTS',
                'TOILETRIES',
                'MEDICINES',
                'TRAVEL_ESSENTIALS',
                'ACCESSORIES',
                'OTHER'
            )
        )
);

CREATE INDEX idx_packing_items_trip_id
    ON packing_items(trip_id);

CREATE INDEX idx_packing_items_trip_packed
    ON packing_items(trip_id, packed);