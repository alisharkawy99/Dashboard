import { getSql, isDatabaseConfigured } from "@/src/lib/db";
import { requireSession } from "@/src/lib/require-session";
import {
  createServerRecord,
  ensureServersSeeded,
  servers as staticServers,
  type DbServerRow,
  type ServerRecord,
  type ServerStatus,
} from "@/src/lib/servers";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

const toJson = (row: DbServerRow) => ({
  id: row.id,
  name: row.name,
  ipAddress: row.ip_address,
  status: row.status,
  responseTimeMs: row.response_time_ms,
  uptimePercent: row.uptime_percent,
  region: row.region,
  lastCheckedAt: row.last_checked_at,
});

const isServerStatus = (v: unknown): v is ServerStatus =>
  v === "Up" || v === "Down" || v === "Degraded";

const parseCreatePayload = (
  body: unknown,
):
  | { ok: true; data: Omit<ServerRecord, "id"> }
  | { ok: false; message: string } => {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Invalid JSON body" };
  }
  const o = body as Record<string, unknown>;
  const name = o.name;
  const ipAddress = o.ipAddress ?? o.ip_address;
  const status = o.status;
  const responseTimeMs = o.responseTimeMs ?? o.response_time_ms;
  const uptimePercent = o.uptimePercent ?? o.uptime_percent;
  const region = o.region;
  const lastCheckedAt = o.lastCheckedAt ?? o.last_checked_at;

  if (typeof name !== "string" || !name.trim()) {
    return { ok: false, message: "name is required" };
  }
  if (typeof ipAddress !== "string" || !ipAddress.trim()) {
    return { ok: false, message: "ipAddress is required" };
  }
  if (!isServerStatus(status)) {
    return { ok: false, message: "status must be Up, Down, or Degraded" };
  }
  if (typeof responseTimeMs !== "number" || !Number.isFinite(responseTimeMs)) {
    return { ok: false, message: "responseTimeMs must be a number" };
  }
  if (typeof uptimePercent !== "number" || !Number.isFinite(uptimePercent)) {
    return { ok: false, message: "uptimePercent must be a number" };
  }
  if (typeof region !== "string" || !region.trim()) {
    return { ok: false, message: "region is required" };
  }
  if (typeof lastCheckedAt !== "string" || !lastCheckedAt.trim()) {
    return { ok: false, message: "lastCheckedAt is required (ISO string)" };
  }

  return {
    ok: true,
    data: {
      name: name.trim(),
      ipAddress: ipAddress.trim(),
      status,
      responseTimeMs: Math.round(responseTimeMs),
      uptimePercent,
      region: region.trim(),
      lastCheckedAt: lastCheckedAt.trim(),
    },
  };
};

export const GET = async () => {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { message: "DATABASE_URL is not configured", servers: staticServers },
      { status: 503 },
    );
  }
  const client = getSql();
  if (!client) {
    return NextResponse.json(
      { message: "Database unavailable", servers: staticServers },
      { status: 503 },
    );
  }
  try {
    await ensureServersSeeded();
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
      ORDER BY name ASC
    `) as DbServerRow[];
    return NextResponse.json(rows.map(toJson));
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to load servers" },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request) => {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured() || !getSql()) {
    return NextResponse.json(
      { message: "DATABASE_URL is required to create servers" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseCreatePayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ message: parsed.message }, { status: 400 });
  }

  try {
    const record = await createServerRecord({
      id: randomUUID(),
      ...parsed.data,
    });
    return NextResponse.json(
      {
        id: record.id,
        name: record.name,
        ipAddress: record.ipAddress,
        status: record.status,
        responseTimeMs: record.responseTimeMs,
        uptimePercent: record.uptimePercent,
        region: record.region,
        lastCheckedAt: record.lastCheckedAt,
      },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Could not create server" },
      { status: 500 },
    );
  }
};
