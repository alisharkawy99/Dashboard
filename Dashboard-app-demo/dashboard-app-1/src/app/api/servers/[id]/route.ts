import { getSql, isDatabaseConfigured } from "@/src/lib/db";
import { requireSession } from "@/src/lib/require-session";
import {
  deleteServerRecord,
  getServerById,
  servers as staticServers,
  type ServerRecord,
  type ServerStatus,
  updateServerRecord,
} from "@/src/lib/servers";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

const isServerStatus = (v: unknown): v is ServerStatus =>
  v === "Up" || v === "Down" || v === "Degraded";

const parsePatchPayload = (
  body: unknown,
):
  | { ok: true; data: Partial<Omit<ServerRecord, "id">> }
  | { ok: false; message: string } => {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Invalid JSON body" };
  }
  const o = body as Record<string, unknown>;
  const data: Partial<Omit<ServerRecord, "id">> = {};

  if ("name" in o) {
    if (typeof o.name !== "string" || !o.name.trim()) {
      return { ok: false, message: "name must be a non-empty string" };
    }
    data.name = o.name.trim();
  }
  if ("ipAddress" in o || "ip_address" in o) {
    const v = o.ipAddress ?? o.ip_address;
    if (typeof v !== "string" || !v.trim()) {
      return { ok: false, message: "ipAddress must be a non-empty string" };
    }
    data.ipAddress = v.trim();
  }
  if ("status" in o) {
    if (!isServerStatus(o.status)) {
      return { ok: false, message: "status must be Up, Down, or Degraded" };
    }
    data.status = o.status;
  }
  if ("responseTimeMs" in o || "response_time_ms" in o) {
    const v = o.responseTimeMs ?? o.response_time_ms;
    if (typeof v !== "number" || !Number.isFinite(v)) {
      return { ok: false, message: "responseTimeMs must be a number" };
    }
    data.responseTimeMs = Math.round(v);
  }
  if ("uptimePercent" in o || "uptime_percent" in o) {
    const v = o.uptimePercent ?? o.uptime_percent;
    if (typeof v !== "number" || !Number.isFinite(v)) {
      return { ok: false, message: "uptimePercent must be a number" };
    }
    data.uptimePercent = v;
  }
  if ("region" in o) {
    if (typeof o.region !== "string" || !o.region.trim()) {
      return { ok: false, message: "region must be a non-empty string" };
    }
    data.region = o.region.trim();
  }
  if ("lastCheckedAt" in o || "last_checked_at" in o) {
    const v = o.lastCheckedAt ?? o.last_checked_at;
    if (typeof v !== "string" || !v.trim()) {
      return { ok: false, message: "lastCheckedAt must be a non-empty string" };
    }
    data.lastCheckedAt = v.trim();
  }

  if (Object.keys(data).length === 0) {
    return { ok: false, message: "No fields to update" };
  }

  return { ok: true, data };
};

export const GET = async (_request: Request, { params }: Params) => {
  const { id } = await params;
  if (!isDatabaseConfigured()) {
    const s = staticServers.find((x) => x.id === id) ?? null;
    if (!s) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(s);
  }
  try {
    const record = await getServerById(id);
    if (!record) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(record);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to load server" },
      { status: 500 },
    );
  }
};

export const PATCH = async (request: Request, { params }: Params) => {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  if (!isDatabaseConfigured() || !getSql()) {
    return NextResponse.json(
      { message: "DATABASE_URL is required to update servers" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parsePatchPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ message: parsed.message }, { status: 400 });
  }

  try {
    const updated = await updateServerRecord(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Could not update server" },
      { status: 500 },
    );
  }
};

export const DELETE = async (_request: Request, { params }: Params) => {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  if (!isDatabaseConfigured() || !getSql()) {
    return NextResponse.json(
      { message: "DATABASE_URL is required to delete servers" },
      { status: 503 },
    );
  }

  try {
    const deleted = await deleteServerRecord(id);
    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted", id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Could not delete server" },
      { status: 500 },
    );
  }
};
