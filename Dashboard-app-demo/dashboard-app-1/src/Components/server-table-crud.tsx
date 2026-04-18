"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ServerRecord } from "@/src/lib/servers";
import { StatusBadge } from "@/src/Components/status-badge";
import { ServerFormModal } from "@/src/Components/server-form-modal";

const readApiError = async (response: Response) => {
  const text = await response.text();
  if (!text) return `${response.status} ${response.statusText}`;
  try {
    const data = JSON.parse(text) as { message?: string };
    if (typeof data.message === "string") return data.message;
  } catch {
    /* ignore */
  }
  return text.slice(0, 200);
};

export const ServerTableCrud = ({
  servers,
  canMutate,
}: {
  servers: ServerRecord[];
  canMutate: boolean;
}) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<ServerRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = () => router.refresh();

  const openCreate = () => {
    setModalMode("create");
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (server: ServerRecord) => {
    setModalMode("edit");
    setEditing(server);
    setModalOpen(true);
  };

  const confirmDelete = async (server: ServerRecord) => {
    if (
      !window.confirm(
        `Delete server "${server.name}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    setDeletingId(server.id);
    try {
      const res = await fetch(`/api/servers/${server.id}`, { method: "DELETE" });
      if (!res.ok) {
        alert(await readApiError(res));
        setDeletingId(null);
        return;
      }
      refresh();
    } catch {
      alert("Network error while deleting.");
    }
    setDeletingId(null);
  };

  if (servers.length === 0) {
    return (
      <>
        <div className="rounded-xl border border-dashed border-app-border bg-app-card p-8 text-center text-app-muted">
          <p>No servers match your current filters.</p>
          {canMutate ? (
            <button
              type="button"
              onClick={openCreate}
              className="mt-4 hover:cursor-pointer rounded-lg bg-app-accent px-4 py-2 text-sm font-medium text-[var(--on-accent)] transition-colors hover:bg-app-accent-hover"
            >
              Add server
            </button>
          ) : null}
        </div>
        <ServerFormModal
          open={modalOpen}
          mode={modalMode}
          server={editing}
          onClose={() => setModalOpen(false)}
          onSaved={refresh}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {canMutate ? (
          <button
            type="button"
            onClick={openCreate}
            className="hover:cursor-pointer rounded-lg bg-app-accent px-4 py-2 text-sm font-semibold text-[var(--on-accent)] shadow-md shadow-app-accent/20 transition-all hover:bg-app-accent-hover"
          >
            Add server
          </button>
        ) : (
          <p className="text-sm text-app-muted">
            Set <code className="rounded bg-app-card-muted px-1">DATABASE_URL</code>{" "}
            to create, edit, or delete servers.
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-app-border bg-app-card shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-app-card-muted text-left text-xs uppercase tracking-wider text-app-muted">
              <tr>
                <th className="px-4 py-3">Server</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Response</th>
                <th className="px-4 py-3">Uptime</th>
                <th className="px-4 py-3">Region</th>
                {canMutate ? (
                  <th className="px-4 py-3 text-right">Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border text-sm">
              {servers.map((server) => (
                <tr
                  key={server.id}
                  className="transition-colors duration-200 hover:bg-[var(--row-hover)]"
                >
                  <td className="px-4 py-3 font-medium text-app-fg">
                    <Link
                      href={`/servers/${server.id}`}
                      className="rounded transition-colors duration-200 hover:text-app-accent hover:underline"
                    >
                      {server.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-app-muted">{server.ipAddress}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={server.status} />
                  </td>
                  <td className="px-4 py-3 text-app-muted">
                    {server.responseTimeMs} ms
                  </td>
                  <td className="px-4 py-3 text-app-muted">
                    {server.uptimePercent.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-app-muted">{server.region}</td>
                  {canMutate ? (
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(server)}
                          className="hover:cursor-pointer rounded-md border border-app-border bg-app-card-muted px-2.5 py-1 text-xs font-medium text-app-fg transition-colors hover:border-app-accent hover:text-app-accent"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === server.id}
                          onClick={() => confirmDelete(server)}
                          className="hover:cursor-pointer rounded-md border border-app-danger/40 bg-app-danger/10 px-2.5 py-1 text-xs font-medium text-app-danger transition-colors hover:bg-app-danger/20 disabled:opacity-50"
                        >
                          {deletingId === server.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ServerFormModal
        open={modalOpen}
        mode={modalMode}
        server={editing}
        onClose={() => setModalOpen(false)}
        onSaved={refresh}
      />
    </>
  );
};
