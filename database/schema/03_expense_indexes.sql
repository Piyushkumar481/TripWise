CREATE INDEX idx_expenses_trip_id
ON expenses(trip_id);

CREATE INDEX idx_expenses_category
ON expenses(category);

CREATE INDEX idx_expenses_date
ON expenses(expense_date);
