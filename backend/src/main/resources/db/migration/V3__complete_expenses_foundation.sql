-- Expense module foundation
-- Flyway Migration V3

ALTER TABLE expenses
    ADD COLUMN IF NOT EXISTS title VARCHAR(150);

ALTER TABLE expenses
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

ALTER TABLE expenses
    ADD COLUMN IF NOT EXISTS notes VARCHAR(1000);

ALTER TABLE expenses
    ADD COLUMN IF NOT EXISTS date DATE;

UPDATE expenses
SET title = 'Expense'
WHERE title IS NULL;

UPDATE expenses
SET date = expense_date
WHERE date IS NULL;

ALTER TABLE expenses
    ALTER COLUMN title SET NOT NULL;

ALTER TABLE expenses
    ALTER COLUMN date SET NOT NULL;

ALTER TABLE expenses
    ALTER COLUMN category TYPE VARCHAR(100);

ALTER TABLE expenses
    ALTER COLUMN date SET NOT NULL;

ALTER TABLE expenses
    DROP COLUMN IF EXISTS expense_date;

ALTER TABLE expenses
    DROP COLUMN IF EXISTS description;

ALTER TABLE expenses
    DROP CONSTRAINT IF EXISTS fk_expenses_trip;

ALTER TABLE expenses
    DROP CONSTRAINT IF EXISTS fk_expense_trip;

ALTER TABLE expenses
    ADD CONSTRAINT fk_expense_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE;

DROP INDEX IF EXISTS idx_expenses_trip_id;

CREATE INDEX IF NOT EXISTS idx_expenses_trip_date
    ON expenses(trip_id, date);
