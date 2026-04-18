import Link from "next/link";
import { ServerRecord } from "@/src/lib/servers";
import { StatusBadge } from "@/src/Components/status-badge";

export const ServerTable = ({ servers }: { servers: ServerRecord[] }) => {
  if (servers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
        No servers match your current filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <table className="min-w-full">
        <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-4 py-3">Server</th>
            <th className="px-4 py-3">IP Address</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Response</th>
            <th className="px-4 py-3">Uptime</th>
            <th className="px-4 py-3">Region</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 text-sm">
          {servers.map((server) => (
            <tr key={server.id} className="hover:bg-zinc-50">
              <td className="px-4 py-3 font-medium text-zinc-900">
                <Link href={`/servers/${server.id}`} className="hover:underline">
                  {server.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-zinc-700">{server.ipAddress}</td>
              <td className="px-4 py-3">
                <StatusBadge status={server.status} />
              </td>
              <td className="px-4 py-3 text-zinc-700">
                {server.responseTimeMs} ms
              </td>
              <td className="px-4 py-3 text-zinc-700">
                {server.uptimePercent.toFixed(2)}%
              </td>
              <td className="px-4 py-3 text-zinc-700">{server.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
