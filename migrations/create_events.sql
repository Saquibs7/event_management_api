CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  event_time TIMESTAMPTZ NOT NULL,
  location VARCHAR(200) NOT NULL,
  capacity INT NOT NULL CHECK (capacity > 0 AND capacity <= 1000),
  created_at TIMESTAMPTZ DEFAULT NOW()
);