import {
  DashboardHeaderSkeleton,
  FilterBarSkeleton,
  TableSkeleton,
} from "@/src/Components/skeleton";

const DashboardLoading = () => {
  return (
    <section className="animate-page-enter space-y-4">
      <DashboardHeaderSkeleton />
      <FilterBarSkeleton />
      <TableSkeleton />
    </section>
  );
};

export default DashboardLoading;
