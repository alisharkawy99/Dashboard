import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/src/Components/logout-button";
import { getCurrentSession } from "@/src/lib/session";

const DashboardLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="text-lg font-semibold text-zinc-900">
            XOrithm Status
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600">{session.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
