import { ServerStatus } from "@/src/lib/servers";

const statusStyle: Record<ServerStatus, string> = {
  Up: "bg-[var(--status-up-bg)] text-[var(--status-up-fg)]",
  Down: "bg-[var(--status-down-bg)] text-[var(--status-down-fg)]",
  Degraded: "bg-[var(--status-degraded-bg)] text-[var(--status-degraded-fg)]",
};

export const StatusBadge = ({ status }: { status: ServerStatus }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-transform duration-200 ${statusStyle[status]}`}
    >
      {status}
    </span>
  );
};
