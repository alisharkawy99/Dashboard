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
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Link
            key={status}
            href={`/dashboard?status=${status}&sort=${currentSort}`}
            className={`rounded-full px-3 py-1.5 text-sm ${
              currentStatus === status
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {status}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-600">Sort:</span>
        <div className="flex flex-wrap gap-2">
          {sorts.map((sort) => (
            <Link
              key={sort.value}
              href={`/dashboard?status=${currentStatus}&sort=${sort.value}`}
              className={`rounded-md px-3 py-1.5 text-sm ${
                currentSort === sort.value
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
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
