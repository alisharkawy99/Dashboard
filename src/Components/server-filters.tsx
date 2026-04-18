import Link from "next/link";
import { ServerSort, ServerStatus } from "@/src/lib/servers";

const statuses: Array<ServerStatus | "All"> = ["All", "Up", "Degraded", "Down"];
const sorts: Array<{ value: ServerSort; label: string }> = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "response-asc", label: "Response (Low to High)" },
  { value: "response-desc", label: "Response (High to Low)" },
];

export const ServerFilters = ({
  currentStatus,
  currentSort,
}: {
  currentStatus: ServerStatus | "All";
  currentSort: ServerSort;
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-app-border bg-app-card p-4 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Link
            key={status}
            href={`/dashboard?status=${status}&sort=${currentSort}`}
            className={`rounded-full px-3 py-1.5 text-sm transition-all duration-200 ${
              currentStatus === status
                ? "bg-app-fg text-app-bg shadow-sm"
                : "bg-app-card-muted text-app-muted hover:bg-app-border hover:text-app-fg"
            }`}
          >
            {status}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-app-muted">Sort:</span>
        <div className="flex flex-wrap gap-2">
          {sorts.map((sort) => (
            <Link
              key={sort.value}
              href={`/dashboard?status=${currentStatus}&sort=${sort.value}`}
              className={`rounded-md px-3 py-1.5 text-sm transition-all duration-200 ${
                currentSort === sort.value
                  ? "bg-app-accent text-[var(--on-accent)] shadow-md shadow-app-accent/20"
                  : "bg-app-card-muted text-app-muted hover:bg-app-border hover:text-app-fg"
              }`}
            >
              {sort.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
