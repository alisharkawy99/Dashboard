"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { readApiErrorMessage } from "@/src/lib/api-error";
import type { ServerRecord } from "@/src/lib/servers";
import { ServerFormModal } from "@/src/Components/server-form-modal";

export const ServerDetailActions = ({
  server,
  canMutate,
}: {
  server: ServerRecord;
  canMutate: boolean;
}) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const refresh = () => router.refresh();

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Delete "${server.name}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/servers/${server.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error(await readApiErrorMessage(res));
        setDeleting(false);
        return;
      }
      toast.success(`Deleted “${server.name}”`);
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Network error while deleting.");
      setDeleting(false);
    }
  };

  if (!canMutate) {
    return (
      <p className="text-sm text-app-muted">
        Set <code className="rounded bg-app-card-muted px-1">DATABASE_URL</code>{" "}
        to edit or delete this server.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-lg border border-app-border bg-app-card-muted px-4 py-2 text-sm font-medium text-app-fg transition-colors hover:border-app-accent hover:text-app-accent"
        >
          Edit
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={handleDelete}
          className="rounded-lg border border-app-danger/40 bg-app-danger/10 px-4 py-2 text-sm font-medium text-app-danger transition-colors hover:bg-app-danger/20 disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>

      <ServerFormModal
        open={modalOpen}
        mode="edit"
        server={server}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          refresh();
          setModalOpen(false);
        }}
      />
    </>
  );
};
