-- Up Migration
CREATE TABLE trips(
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     title varchar(120) NOT NULL,
     destination varchar(300) NOT NULL,
     start_date date NOT NULL,
     end_date date NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_trips_user_id ON trips(user_id);
-- Down Migration

DROP TABLE trips;