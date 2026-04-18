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
    <section className="animate-page-enter space-y-4">
      <Link
        href="/dashboard"
        className="inline-block text-sm text-app-accent transition-colors duration-200 hover:text-app-accent-hover hover:underline"
      >
        ← Back to dashboard
      </Link>

      <div className="rounded-xl border border-app-border bg-app-card p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-app-fg">{server.name}</h1>
            <p className="mt-1 text-sm text-app-muted">Server ID: {server.id}</p>
          </div>
          <StatusBadge status={server.status} />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-app-card-muted p-4 transition-colors duration-200">
            <dt className="text-xs uppercase tracking-wide text-app-muted">
              IP Address
            </dt>
            <dd className="mt-1 text-sm font-medium text-app-fg">
              {server.ipAddress}
            </dd>
          </div>
          <div className="rounded-lg bg-app-card-muted p-4 transition-colors duration-200">
            <dt className="text-xs uppercase tracking-wide text-app-muted">
              Response Time
            </dt>
            <dd className="mt-1 text-sm font-medium text-app-fg">
              {server.responseTimeMs} ms
            </dd>
          </div>
          <div className="rounded-lg bg-app-card-muted p-4 transition-colors duration-200">
            <dt className="text-xs uppercase tracking-wide text-app-muted">Uptime</dt>
            <dd className="mt-1 text-sm font-medium text-app-fg">
              {server.uptimePercent.toFixed(2)}%
            </dd>
          </div>
          <div className="rounded-lg bg-app-card-muted p-4 transition-colors duration-200">
            <dt className="text-xs uppercase tracking-wide text-app-muted">Region</dt>
            <dd className="mt-1 text-sm font-medium text-app-fg">{server.region}</dd>
          </div>
        </dl>

        <div className="mt-4 rounded-lg border border-dashed border-app-border p-4 text-sm text-app-muted">
          Last checked at {new Date(server.lastCheckedAt).toLocaleString()}.
          Status history timeline can be integrated in this section when a live API
          is connected.
        </div>
      </div>
    </section>
  );
};

export default ServerDetailsPage;
