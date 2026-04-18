import { neon } from "@neondatabase/serverless";
let sql: ReturnType<typeof neon> | null = null;
let schemaReady: Promise<void> | null = null;

export const getSql = () => {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!sql) sql = neon(url);
  return sql;
}

export const ensureUserSchema = async () => {
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
    })();
  }
  await schemaReady;
}
