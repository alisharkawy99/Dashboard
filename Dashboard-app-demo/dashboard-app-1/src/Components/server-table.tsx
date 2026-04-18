import Link from "next/link";
import { ServerRecord } from "@/src/lib/servers";
import { StatusBadge } from "@/src/Components/status-badge";

export const ServerTable = ({ servers }: { servers: ServerRecord[] }) => {
  if (servers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-app-border bg-app-card p-8 text-center text-app-muted transition-colors duration-300">
        No servers match your current filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-app-border bg-app-card shadow-sm transition-all duration-300 hover:shadow-md">
      <table className="min-w-full">
        <thead className="bg-app-card-muted text-left text-xs uppercase tracking-wider text-app-muted">
          <tr>
            <th className="px-4 py-3">Server</th>
            <th className="px-4 py-3">IP Address</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Response</th>
            <th className="px-4 py-3">Uptime</th>
            <th className="px-4 py-3">Region</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
