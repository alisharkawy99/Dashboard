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
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <header className="sticky top-0 z-20 border-b border-app-border bg-app-card/90 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <Link
            href="/dashboard"
            className="text-lg font-semibold text-app-fg transition-colors duration-200 hover:text-app-accent"
          >
            Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-app-muted transition-colors duration-200">
              {session.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
