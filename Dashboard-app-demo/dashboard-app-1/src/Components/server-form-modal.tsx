"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { readApiErrorMessage } from "@/src/lib/api-error";
import type { ServerRecord, ServerStatus } from "@/src/lib/servers";

const STATUSES: ServerStatus[] = ["Up", "Down", "Degraded"];

const toDatetimeLocalValue = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fromDatetimeLocalValue = (s: string) => new Date(s).toISOString();

type Mode = "create" | "edit";

export const ServerFormModal = ({
  open,
  mode,
  server,
  onClose,
  onSaved,
}: {
  open: boolean;
  mode: Mode;
  server: ServerRecord | null;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [name, setName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [status, setStatus] = useState<ServerStatus>("Up");
  const [responseTimeMs, setResponseTimeMs] = useState(0);
  const [uptimePercent, setUptimePercent] = useState(100);
  const [region, setRegion] = useState("");
  const [lastCheckedAtLocal, setLastCheckedAtLocal] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && server) {
      setName(server.name);
      setIpAddress(server.ipAddress);
      setStatus(server.status);
      setResponseTimeMs(server.responseTimeMs);
      setUptimePercent(server.uptimePercent);
      setRegion(server.region);
      setLastCheckedAtLocal(toDatetimeLocalValue(server.lastCheckedAt));
    } else {
      setName("");
      setIpAddress("");
      setStatus("Up");
      setResponseTimeMs(0);
      setUptimePercent(100);
      setRegion("us-east-1");
      setLastCheckedAtLocal(toDatetimeLocalValue(new Date().toISOString()));
    }
  }, [open, mode, server]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const lastCheckedAt = lastCheckedAtLocal
      ? fromDatetimeLocalValue(lastCheckedAtLocal)
      : new Date().toISOString();

    try {
      if (mode === "create") {
        const res = await fetch("/api/servers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            ipAddress: ipAddress.trim(),
            status,
            responseTimeMs,
            uptimePercent,
            region: region.trim(),
            lastCheckedAt,
          }),
        });
        if (!res.ok) {
          toast.error(await readApiErrorMessage(res));
          setSubmitting(false);
          return;
        }
        toast.success("Server created");
      } else if (mode === "edit" && server) {
        const res = await fetch(`/api/servers/${server.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            ipAddress: ipAddress.trim(),
            status,
            responseTimeMs,
            uptimePercent,
            region: region.trim(),
            lastCheckedAt,
          }),
        });
        if (!res.ok) {
          toast.error(await readApiErrorMessage(res));
          setSubmitting(false);
          return;
        }
        toast.success("Server updated");
      }
      onSaved();
      onClose();
    } catch {
      toast.error("Network error. Try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 transition-opacity"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className="relative z-10 mt-20 w-full max-w-lg rounded-xl border border-app-border bg-app-card p-6 shadow-xl animate-fade-in-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="server-form-title"
      >
        <h2 id="server-form-title" className="text-lg font-semibold text-app-fg">
          {mode === "create" ? "Add server" : "Edit server"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="block text-sm text-app-fg">
            Name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-app-border bg-app-bg px-3 py-2 text-app-fg outline-none transition-all focus:border-app-accent focus:ring-2 focus:ring-app-accent/30"
            />
          </label>
          <label className="block text-sm text-app-fg">
            IP address
            <input
              required
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="mt-1 w-full rounded-lg border border-app-border bg-app-bg px-3 py-2 text-app-fg outline-none transition-all focus:border-app-accent focus:ring-2 focus:ring-app-accent/30"
            />
          </label>
          <label className="block text-sm text-app-fg">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ServerStatus)}
              className="mt-1 w-full rounded-lg border border-app-border bg-app-bg px-3 py-2 text-app-fg outline-none transition-all focus:border-app-accent focus:ring-2 focus:ring-app-accent/30"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm text-app-fg">
              Response (ms)
              <input
                required
                type="number"
                step={1}
                min={0}
                value={responseTimeMs}
                onChange={(e) => setResponseTimeMs(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-app-border bg-app-bg px-3 py-2 text-app-fg outline-none transition-all focus:border-app-accent focus:ring-2 focus:ring-app-accent/30"
              />
            </label>
            <label className="block text-sm text-app-fg">
              Uptime (%)
              <input
                required
                type="number"
                step={0.01}
                min={0}
                max={100}
                value={uptimePercent}
                onChange={(e) => setUptimePercent(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-app-border bg-app-bg px-3 py-2 text-app-fg outline-none transition-all focus:border-app-accent focus:ring-2 focus:ring-app-accent/30"
              />
            </label>
          </div>
          <label className="block text-sm text-app-fg">
            Region
            <input
              required
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. us-east-1"
              className="mt-1 w-full rounded-lg border border-app-border bg-app-bg px-3 py-2 text-app-fg outline-none transition-all focus:border-app-accent focus:ring-2 focus:ring-app-accent/30"
            />
          </label>
          <label className="block text-sm text-app-fg">
            Last checked
            <input
              required
              type="datetime-local"
              value={lastCheckedAtLocal}
              onChange={(e) => setLastCheckedAtLocal(e.target.value)}
              className="mt-1 w-full rounded-lg border border-app-border bg-app-bg px-3 py-2 text-app-fg outline-none transition-all focus:border-app-accent focus:ring-2 focus:ring-app-accent/30"
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-app-border px-4 py-2 text-sm font-medium text-app-fg transition-colors hover:bg-app-card-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-app-accent px-4 py-2 text-sm font-medium text-[var(--on-accent)] transition-all hover:bg-app-accent-hover disabled:opacity-60"
            >
              {submitting ? "Saving…" : mode === "create" ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
