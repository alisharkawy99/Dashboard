import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/src/Components/status-badge";
import { getServerById } from "@/src/lib/servers";

const ServerDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const server = getServerById(id);

  if (!server) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">
        Back to dashboard
      </Link>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">{server.name}</h1>
            <p className="mt-1 text-sm text-zinc-500">Server ID: {server.id}</p>
          </div>
          <StatusBadge status={server.status} />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-wide text-zinc-500">IP Address</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">
              {server.ipAddress}
            </dd>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-wide text-zinc-500">
              Response Time
            </dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">
              {server.responseTimeMs} ms
            </dd>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-wide text-zinc-500">Uptime</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">
              {server.uptimePercent.toFixed(2)}%
            </dd>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-wide text-zinc-500">Region</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">{server.region}</dd>
          </div>
        </dl>

        <div className="mt-4 rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-600">
          Last checked at {new Date(server.lastCheckedAt).toLocaleString()}.
          Status history timeline can be integrated in this section when a live API is connected.
        </div>
      </div>
    </section>
  );
};

export default ServerDetailsPage;
