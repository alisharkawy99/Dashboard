-- Optional: run in Neon SQL Editor if you prefer to create tables manually.
-- Otherwise `ensureSchema()` in src/lib/db.ts runs on first use.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS servers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  status TEXT NOT NULL,
  response_time_ms INTEGER NOT NULL,
  uptime_percent REAL NOT NULL,
  region TEXT NOT NULL,
  last_checked_at TEXT NOT NULL
);
