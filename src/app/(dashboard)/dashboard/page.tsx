import { ServerFilters } from "@/src/Components/server-filters";
import { ServerTable } from "@/src/Components/server-table";
import { getServers, ServerSort, ServerStatus } from "@/src/lib/servers";

const allowedStatuses: Array<ServerStatus | "All"> = [
  "All",
  "Up",
  "Down",
  "Degraded",
];

const allowedSorts: ServerSort[] = [
  "name-asc",
  "name-desc",
  "response-asc",
  "response-desc",
];

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sort?: string }>;
}) => {
  const { status, sort } = await searchParams;
  const selectedStatus = allowedStatuses.includes(status as ServerStatus | "All")
    ? (status as ServerStatus | "All")
    : "All";
  const selectedSort = allowedSorts.includes(sort as ServerSort)
    ? (sort as ServerSort)
    : "name-asc";

  const serverList = getServers({
    status: selectedStatus,
    sort: selectedSort,
  });

  return (
    <section className="animate-page-enter space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-app-fg">Service Status</h1>
        <p className="mt-1 text-sm text-app-muted">
          Monitor service health, uptime and response latency in one view.
        </p>
      </div>

      <ServerFilters currentStatus={selectedStatus} currentSort={selectedSort} />
      <ServerTable servers={serverList} />
    </section>
  );
};

export default DashboardPage;
