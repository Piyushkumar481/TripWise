CREATE INDEX idx_itinerary_trip_id
ON itinerary_items(trip_id);

CREATE INDEX idx_itinerary_activity_date
ON itinerary_items(activity_date);

CREATE INDEX idx_itinerary_category
ON itinerary_items(category);