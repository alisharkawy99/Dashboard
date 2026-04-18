import { neon } from "@neondatabase/serverless";

/** Trim and strip accidental wrapping quotes from .env copy/paste. */
export const normalizeDatabaseUrl = (raw: string | undefined): string | null => {
  if (raw == null) return null;
  let u = raw.trim();
  if (
    (u.startsWith('"') && u.endsWith('"')) ||
    (u.startsWith("'") && u.endsWith("'"))
  ) {
    u = u.slice(1, -1).trim();
  }
  return u.length > 0 ? u : null;
};

let sql: ReturnType<typeof neon> | null = null;
let schemaReady: Promise<void> | null = null;
let cachedUrl: string | null = null;

export const getSql = () => {
  const url = normalizeDatabaseUrl(process.env.DATABASE_URL);
  if (!url) return null;
  if (cachedUrl !== url) {
    cachedUrl = url;
    sql = neon(url);
    schemaReady = null;
  }
  return sql;
};

export const isDatabaseConfigured = () =>
  Boolean(normalizeDatabaseUrl(process.env.DATABASE_URL));

/** True when Neon’s HTTPS fetch fails (DNS, firewall, bad URL, SSL, IPv6 on Windows, etc.). */
export const isDatabaseNetworkError = (e: unknown): boolean => {
  const msg = e instanceof Error ? e.message : String(e);
  return (
    msg.includes("fetch failed") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("ENOTFOUND") ||
    msg.includes("certificate") ||
    msg.includes("ETIMEDOUT")
  );
};

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
