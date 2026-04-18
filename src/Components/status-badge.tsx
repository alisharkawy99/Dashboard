import { ServerStatus } from "@/src/lib/servers";

const statusClassMap: Record<ServerStatus, string> = {
  Up: "bg-emerald-100 text-emerald-800",
  Down: "bg-red-100 text-red-800",
  Degraded: "bg-amber-100 text-amber-800",
};

export const StatusBadge = ({ status }: { status: ServerStatus }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassMap[status]}`}
    >
      {status}
    </span>
  );
};
