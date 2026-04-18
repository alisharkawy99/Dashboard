
import { ensureUserSchema, getSql } from "@/src/lib/db";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

const memoryUsers = new Map<string, User>();

const rowToUser = (row: {
  id: string;
  email: string;
  name: string;
  password_hash: string;
}): User => {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
  };
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const key = email.toLowerCase();
  const client = getSql();
  if (client) {
    await ensureUserSchema();
    const rows = (await client`
      SELECT id, email, name, password_hash
      FROM users
      WHERE email = ${key}
    `) as {
      id: string;
      email: string;
      name: string;
      password_hash: string;
    }[];
    const row = rows[0];
    return row ? rowToUser(row) : null;
  }
  return memoryUsers.get(key) ?? null;
}

export const createUser = async (user: User): Promise<User> => {
  const key = user.email.toLowerCase();
  const normalized = { ...user, email: key };
  const client = getSql();
  if (client) {
    await ensureUserSchema();
    await client`
      INSERT INTO users (id, email, name, password_hash)
      VALUES (${normalized.id}, ${normalized.email}, ${normalized.name}, ${normalized.passwordHash})
    `;
    return normalized;
    }
  memoryUsers.set(key, normalized);
  return normalized;
}
