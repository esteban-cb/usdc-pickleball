CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  event_id TEXT NOT NULL,
  player_address TEXT NOT NULL,
  player_name TEXT NOT NULL,
  dupr_id TEXT NOT NULL,
  dupr_rating DECIMAL(3,1) NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, player_address)
);