CREATE INDEX idx_trips_user_id
ON trips(user_id);

CREATE INDEX idx_trips_start_date
ON trips(start_date);

CREATE INDEX idx_trips_destination_city
ON trips(destination_city);

CREATE INDEX idx_trips_status
ON trips(status);