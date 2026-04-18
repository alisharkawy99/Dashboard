import { neon } from "@neondatabase/serverless";

let sql: ReturnType<typeof neon> | null = null;
let schemaReady: Promise<void> | null = null;

export const getSql = () => {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!sql) sql = neon(url);
  return sql;
};

export const isDatabaseConfigured = () => Boolean(process.env.DATABASE_URL?.trim());

/** One bootstrap: `users` + `servers` in the same database. */
export const ensureSchema = async () => {
  const client = getSql();
  if (!client) return;
  if (!schemaReady) {
    schemaReady = (async () => {
      await client`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          password_hash TEXT NOT NULL
        )
      `;
      await client`
        CREATE TABLE IF NOT EXISTS servers (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          ip_address TEXT NOT NULL,
          status TEXT NOT NULL,
          response_time_ms INTEGER NOT NULL,
          uptime_percent REAL NOT NULL,
          region TEXT NOT NULL,
          last_checked_at TEXT NOT NULL
        )
      `;
    })();
  }
  await schemaReady;
};
