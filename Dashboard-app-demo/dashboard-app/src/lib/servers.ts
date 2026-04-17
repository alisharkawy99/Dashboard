export type ServerStatus = "Up" | "Down" | "Degraded";

export type ServerRecord = {
  id: string;
  name: string;
  ipAddress: string;
  status: ServerStatus;
  responseTimeMs: number;
  uptimePercent: number;
  region: string;
  lastCheckedAt: string;
};

export const servers: ServerRecord[] = [
  {
    id: "srv-1",
    name: "API Gateway",
    ipAddress: "10.20.1.11",
    status: "Up",
    responseTimeMs: 82,
    uptimePercent: 99.99,
    region: "eu-central-1",
    lastCheckedAt: "2026-04-17T08:05:00Z",
  },
  {
    id: "srv-2",
    name: "Auth Service",
    ipAddress: "10.20.1.21",
    status: "Degraded",
    responseTimeMs: 410,
    uptimePercent: 99.23,
    region: "eu-central-1",
    lastCheckedAt: "2026-04-17T08:05:00Z",
  },
  {
    id: "srv-3",
    name: "Payments Worker",
    ipAddress: "10.20.2.9",
    status: "Down",
    responseTimeMs: 0,
    uptimePercent: 97.12,
    region: "us-east-1",
    lastCheckedAt: "2026-04-17T08:05:00Z",
  },
  {
    id: "srv-4",
    name: "Analytics Node",
    ipAddress: "10.20.3.44",
    status: "Up",
    responseTimeMs: 121,
    uptimePercent: 99.81,
    region: "ap-south-1",
    lastCheckedAt: "2026-04-17T08:05:00Z",
  },
  {
    id: "srv-5",
    name: "Media Processor",
    ipAddress: "10.20.2.18",
    status: "Degraded",
    responseTimeMs: 355,
    uptimePercent: 98.74,
    region: "us-east-1",
    lastCheckedAt: "2026-04-17T08:05:00Z",
  },
];

export type ServerSort = "name-asc" | "name-desc" | "response-asc" | "response-desc";

export function getServers({
  status,
  sort = "name-asc",
}: {
  status?: ServerStatus | "All";
  sort?: ServerSort;
}) {
  const filtered =
    status && status !== "All"
      ? servers.filter((server) => server.status === status)
      : [...servers];
  return filtered.sort((a, b) => {
    switch (sort) {
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "response-asc":
        return a.responseTimeMs - b.responseTimeMs;
      case "response-desc":
        return b.responseTimeMs - a.responseTimeMs;
      case "name-asc":
      default:
        return a.name.localeCompare(b.name);
    }
  });
}

export function getServerById(serverId: string) {
  return servers.find((server) => server.id === serverId) ?? null;
}
