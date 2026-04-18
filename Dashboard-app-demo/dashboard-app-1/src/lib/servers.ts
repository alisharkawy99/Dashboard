import { randomUUID } from "crypto";
import { ensureSchema, getSql } from "./db";

export type ServerStatus = "Up" | "Down" | "Degraded";

export type ServerRecord = {
  id: string;
  name: string;
  ipAddress: string;
  status: ServerStatus;
  responseTimeMs: number;
  uptimePercent: number;
  region: string;
  lastCheckedAt: string;
};

/** Seed + fallback when `DATABASE_URL` is unset. */
export const servers: ServerRecord[] = [
  {
    id: "srv-1",
    name: "API Gateway",
    ipAddress: "10.20.1.11",
    status: "Up",
    responseTimeMs: 82,
    uptimePercent: 99.99,
    region: "eu-central-1",
    lastCheckedAt: "2026-04-17T08:05:00Z",
  },
  {
    id: "srv-2",
    name: "Auth Service",
    ipAddress: "10.20.1.21",
    status: "Degraded",
    responseTimeMs: 410,
    uptimePercent: 99.23,
    region: "eu-central-1",
    lastCheckedAt: "2026-04-17T08:05:00Z",
  },
  {
    id: "srv-3",
    name: "Payments Worker",
    ipAddress: "10.20.2.9",
    status: "Down",
    responseTimeMs: 0,
    uptimePercent: 97.12,
    region: "us-east-1",
    lastCheckedAt: "2026-04-17T08:05:00Z",
  },
  {
    id: "srv-4",
    name: "Analytics Node",
    ipAddress: "10.20.3.44",
    status: "Up",
    responseTimeMs: 121,
    uptimePercent: 99.81,
    region: "ap-south-1",
    lastCheckedAt: "2026-04-17T08:05:00Z",
  },
  {
    id: "srv-5",
    name: "Media Processor",
    ipAddress: "10.20.2.18",
    status: "Degraded",
    responseTimeMs: 355,
    uptimePercent: 98.74,
    region: "us-east-1",
    lastCheckedAt: "2026-04-17T08:05:00Z",
  },
];

export type ServerSort =
  | "name-asc"
  | "name-desc"
  | "response-asc"
  | "response-desc";

export type DbServerRow = {
  id: string;
  name: string;
  ip_address: string;
  status: string;
  response_time_ms: number;
  uptime_percent: number;
  region: string;
  last_checked_at: string;
};

export const rowToRecord = (row: DbServerRow): ServerRecord => ({
  id: row.id,
  name: row.name,
  ipAddress: row.ip_address,
  status: row.status as ServerStatus,
  responseTimeMs: row.response_time_ms,
  uptimePercent: row.uptime_percent,
  region: row.region,
  lastCheckedAt: row.last_checked_at,
});

const insertDummyServersIfEmpty = async (
  client: NonNullable<ReturnType<typeof getSql>>,
) => {
  const countRows = (await client`
    SELECT count(*)::int AS c FROM servers
  `) as { c: number }[];
  if ((countRows[0]?.c ?? 0) > 0) return;

  for (const s of servers) {
    await client`
      INSERT INTO servers (
        id, name, ip_address, status, response_time_ms,
        uptime_percent, region, last_checked_at
      )
      VALUES (
        ${s.id},
        ${s.name},
        ${s.ipAddress},
        ${s.status},
        ${s.responseTimeMs},
        ${s.uptimePercent},
        ${s.region},
        ${s.lastCheckedAt}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
};

/** Schema + seed; safe to call before reads/writes. */
export const seedServersIfEmpty = async () => {
  const client = getSql();
  if (!client) return;
  await ensureSchema();
  await insertDummyServersIfEmpty(client);
};

/** Alias used by `/api/servers`. */
export const ensureServersSeeded = seedServersIfEmpty;

export const getServersFromDb = async (): Promise<ServerRecord[]> => {
  const client = getSql();
  if (!client) return [];
  await seedServersIfEmpty();
  const rows = (await client`
    SELECT
      id,
      name,
      ip_address,
      status,
      response_time_ms,
      uptime_percent,
      region,
      last_checked_at
    FROM servers
  `) as DbServerRow[];
  return rows.map(rowToRecord);
};

export const filterAndSort = (
  list: ServerRecord[],
  {
    status,
    sort = "name-asc",
  }: {
    status?: ServerStatus | "All";
    sort?: ServerSort;
  },
): ServerRecord[] => {
  const filtered =
    status && status !== "All"
      ? list.filter((server) => server.status === status)
      : [...list];
  return filtered.sort((a, b) => {
    switch (sort) {
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "response-asc":
        return a.responseTimeMs - b.responseTimeMs;
      case "response-desc":
        return b.responseTimeMs - a.responseTimeMs;
      case "name-asc":
      default:
        return a.name.localeCompare(b.name);
    }
  });
};

export const getServers = async ({
  status,
  sort = "name-asc",
}: {
  status?: ServerStatus | "All";
  sort?: ServerSort;
}): Promise<ServerRecord[]> => {
  if (!getSql()) {
    return filterAndSort([...servers], { status, sort });
  }
  const list = await getServersFromDb();
  return filterAndSort(list, { status, sort });
};

export const getServerById = async (
  serverId: string,
): Promise<ServerRecord | null> => {
  if (!getSql()) {
    return servers.find((s) => s.id === serverId) ?? null;
  }
  const client = getSql();
  if (!client) return null;
  await seedServersIfEmpty();
  const rows = (await client`
    SELECT
      id,
      name,
      ip_address,
      status,
      response_time_ms,
      uptime_percent,
      region,
      last_checked_at
    FROM servers
    WHERE id = ${serverId}
  `) as DbServerRow[];
  const row = rows[0];
  return row ? rowToRecord(row) : null;
};

export const createServerRecord = async (
  input: Omit<ServerRecord, "id"> & { id?: string },
): Promise<ServerRecord> => {
  const client = getSql();
  if (!client) {
    throw new Error("DATABASE_URL is required to create servers");
  }
  await seedServersIfEmpty();
  const id = input.id ?? randomUUID();
  const record: ServerRecord = {
    id,
    name: input.name,
    ipAddress: input.ipAddress,
    status: input.status,
    responseTimeMs: input.responseTimeMs,
    uptimePercent: input.uptimePercent,
    region: input.region,
    lastCheckedAt: input.lastCheckedAt,
  };
  await client`
    INSERT INTO servers (
      id, name, ip_address, status, response_time_ms,
      uptime_percent, region, last_checked_at
    )
    VALUES (
      ${record.id},
      ${record.name},
      ${record.ipAddress},
      ${record.status},
      ${record.responseTimeMs},
      ${record.uptimePercent},
      ${record.region},
      ${record.lastCheckedAt}
    )
  `;
  return record;
};

export const updateServerRecord = async (
  id: string,
  patch: Partial<Omit<ServerRecord, "id">>,
): Promise<ServerRecord | null> => {
  const client = getSql();
  if (!client) {
    throw new Error("DATABASE_URL is required to update servers");
  }
  await seedServersIfEmpty();
  const existing = await getServerById(id);
  if (!existing) return null;
  const next: ServerRecord = {
    ...existing,
    ...patch,
    id: existing.id,
  };
  await client`
    UPDATE servers
    SET
      name = ${next.name},
      ip_address = ${next.ipAddress},
      status = ${next.status},
      response_time_ms = ${next.responseTimeMs},
      uptime_percent = ${next.uptimePercent},
      region = ${next.region},
      last_checked_at = ${next.lastCheckedAt}
    WHERE id = ${id}
  `;
  return next;
};

export const deleteServerRecord = async (id: string): Promise<boolean> => {
  const client = getSql();
  if (!client) {
    throw new Error("DATABASE_URL is required to delete servers");
  }
  await seedServersIfEmpty();
  const result = (await client`
    DELETE FROM servers WHERE id = ${id} RETURNING id
  `) as { id: string }[];
  return result.length > 0;
};
