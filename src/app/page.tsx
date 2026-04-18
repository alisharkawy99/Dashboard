"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const features = [
    {
      title: "Live health signals",
      body: "See status, latency, and uptime in one glance—built for fast incident triage.",
    },
    {
      title: "Filter & sort",
      body: "Slice the fleet by state and order by name or response time without leaving the page.",
    },
    {
      title: "Per-server detail",
      body: "Drill into any host for IP, region, and last check—ready to wire to a real API.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-app-bg text-app-fg transition-colors duration-300">
      <div
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-app-accent/25 blur-3xl animate-subtle-glow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-32 h-80 w-80 rounded-full bg-app-accent-secondary/20 blur-3xl animate-subtle-glow [animation-delay:1.2s]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.12]"
        aria-hidden
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 animate-fade-in-up">
        <span className="text-sm font-semibold tracking-tight text-app-fg">
          XOrithm
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="rounded-lg px-3 py-2 text-sm font-medium text-app-muted transition-colors duration-200 hover:text-app-fg"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="rounded-lg bg-app-accent px-4 py-2 text-sm font-semibold text-[var(--on-accent)] shadow-lg shadow-app-accent/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-app-accent-hover hover:shadow-app-accent/35"
          >
            Get started
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 pt-8 md:pt-14">
        <section className="max-w-3xl animate-page-enter">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-app-border bg-app-card/80 px-3 py-1 text-xs font-medium text-app-muted backdrop-blur-sm transition-colors duration-300">
            <span className="h-1.5 w-1.5 rounded-full bg-app-accent-secondary shadow-[0_0_8px_var(--accent-secondary)]" />
            Operations-ready status surface
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-app-fg md:text-5xl lg:text-6xl">
            Know your stack before{" "}
            <span className="bg-gradient-to-r from-app-accent to-app-accent-secondary bg-clip-text text-transparent">
              users do
            </span>
            .
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-app-muted md:text-xl">
            A focused service status dashboard for teams who need clarity under
            pressure—health, latency, and uptime without the noise.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="rounded-xl bg-app-accent px-6 py-3 text-sm font-semibold text-[var(--on-accent)] shadow-lg shadow-app-accent/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-app-accent-hover hover:shadow-app-accent/40"
            >
              Open dashboard
            </button>
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="rounded-xl border border-app-border bg-app-card px-6 py-3 text-sm font-semibold text-app-fg transition-all duration-200 hover:border-app-accent/50 hover:bg-app-card-muted"
            >
              Create account
            </button>
          </div>
          <p className="mt-8 text-sm text-app-muted">
            Already using XOrithm?{" "}
            <Link
              href="/login"
              className="font-medium text-app-accent underline-offset-4 transition-colors duration-200 hover:text-app-accent-hover hover:underline"
            >
              Sign in to your workspace
            </Link>
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="group rounded-2xl border border-app-border bg-app-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-app-accent/30 hover:shadow-lg hover:shadow-app-accent/5"
              style={{ animationDelay: `${100 + i * 80}ms` }}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-app-card-muted text-sm font-bold text-app-accent transition-transform duration-300 group-hover:scale-105">
                {i + 1}
              </div>
              <h2 className="text-lg font-semibold text-app-fg">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-app-muted">
                {f.body}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-app-border bg-gradient-to-br from-app-card to-app-card-muted p-8 md:p-10 transition-all duration-300">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-app-fg">
                Ready when your next incident is.
              </h2>
              <p className="mt-2 max-w-xl text-app-muted">
                Sign in to monitor servers, or create an account to get a fresh
                workspace in seconds.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="rounded-xl bg-app-accent px-6 py-3 text-sm font-semibold text-[var(--on-accent)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-app-accent-hover"
              >
                Create account
              </button>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="rounded-xl border border-app-border bg-app-bg px-6 py-3 text-sm font-semibold text-app-fg transition-all duration-200 hover:bg-app-card"
              >
                Login
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
