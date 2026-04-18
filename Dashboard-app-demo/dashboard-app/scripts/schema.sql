-- Optional: run in Neon SQL Editor if you prefer to create the table manually.
-- Otherwise the app creates this automatically on first API request.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL
);
