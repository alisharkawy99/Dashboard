export const SkeletonLine = ({
  className = "",
  rounded = "rounded-md",
}: {
  className?: string;
  rounded?: string;
}) => (
  <div className={`skeleton-shimmer ${rounded} ${className}`} aria-hidden />
);

export const TableSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-app-border bg-app-card transition-shadow duration-300">
    <div className="border-b border-app-border bg-app-card-muted px-4 py-3">
      <div className="flex gap-6">
        {["w-24", "w-28", "w-20", "w-24", "w-20", "w-20"].map((w) => (
          <SkeletonLine key={w} className={`h-3 ${w}`} />
        ))}
      </div>
    </div>
    <div className="divide-y divide-app-border">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-6 px-4 py-4 transition-colors duration-200"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <SkeletonLine className="h-4 w-36" />
          <SkeletonLine className="h-4 w-28" />
          <SkeletonLine className="h-6 w-20 rounded-full" />
          <SkeletonLine className="h-4 w-16" />
          <SkeletonLine className="h-4 w-14" />
          <SkeletonLine className="h-4 w-24" />
        </div>
      ))}
    </div>
  </div>
);

export const ServerDetailSkeleton = () => (
  <div className="animate-page-enter space-y-4">
    <SkeletonLine className="h-4 w-36 rounded" />
    <div className="rounded-xl border border-app-border bg-app-card p-6 transition-shadow duration-300">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <SkeletonLine className="h-8 w-56" />
          <SkeletonLine className="h-4 w-40" />
        </div>
        <SkeletonLine className="h-8 w-24 rounded-full" />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg bg-app-card-muted p-4 transition-transform duration-200"
          >
            <SkeletonLine className="mb-2 h-3 w-24" />
            <SkeletonLine className="h-5 w-full max-w-[12rem]" />
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-dashed border-app-border p-4">
        <SkeletonLine className="h-4 w-full max-w-xl" />
      </div>
    </div>
  </div>
);

export const DashboardHeaderSkeleton = () => (
  <div className="space-y-2">
    <SkeletonLine className="h-8 w-48 max-w-full" />
    <SkeletonLine className="h-4 w-72 max-w-full" />
  </div>
);

export const FilterBarSkeleton = () => (
  <div className="flex flex-col gap-3 rounded-xl border border-app-border bg-app-card p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonLine key={i} className="h-9 w-16 rounded-full" />
      ))}
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <SkeletonLine className="h-4 w-10" />
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonLine key={i} className="h-9 w-28 rounded-md" />
      ))}
    </div>
  </div>
);
