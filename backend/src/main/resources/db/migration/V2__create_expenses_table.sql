-- Lesson 89: Expenses database foundation
-- Preserve the existing Expense module while adding
-- the columns required by the upcoming Expenses model.

ALTER TABLE expenses
    ADD COLUMN IF NOT EXISTS title VARCHAR(150);

ALTER TABLE expenses
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

-- Existing records receive a safe default title.
UPDATE expenses
SET title = 'Expense'
WHERE title IS NULL;

ALTER TABLE expenses
    ALTER COLUMN title SET NOT NULL;

ALTER TABLE expenses
    ALTER COLUMN category TYPE VARCHAR(100);

ALTER TABLE expenses
    ALTER COLUMN description TYPE VARCHAR(1000);

-- Keep existing expense_date column for backward compatibility.
ALTER TABLE expenses
    ALTER COLUMN expense_date SET NOT NULL;

-- Replace the old FK with the cascade behavior required
-- by the Expenses database design.
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
    ON expenses(trip_id, expense_date);

-- Keep the initial trip schema aligned with the existing Trip entity.
ALTER TABLE trips
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;

