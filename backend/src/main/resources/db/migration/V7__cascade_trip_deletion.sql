-- Allow trip deletion to remove its dependent itinerary and legacy document records.

ALTER TABLE itinerary_items
    DROP CONSTRAINT IF EXISTS fk_itinerary_items_trip;

ALTER TABLE itinerary_items
    ADD CONSTRAINT fk_itinerary_items_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE;

ALTER TABLE documents
    DROP CONSTRAINT IF EXISTS fk_documents_trip;

ALTER TABLE documents
    ADD CONSTRAINT fk_documents_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE;
