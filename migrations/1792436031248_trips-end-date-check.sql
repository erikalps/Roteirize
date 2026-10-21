-- Up Migration
ALTER TABLE trips
  ADD CONSTRAINT trips_end_date_after_start_date
  CHECK (end_date >= start_date);

-- Down Migration
ALTER TABLE trips
  DROP CONSTRAINT trips_end_date_after_start_date;