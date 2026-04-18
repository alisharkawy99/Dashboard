"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AuthForm = ({ mode }: { mode: "login" | "signup" }) => {
  const isSignup = mode === "signup" ? true : false;
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    const readErrorMessage = async (response: Response) => {
      const text = await response.text();
      if (!text) return `${response.status} ${response.statusText}`;
      try {
        const data = JSON.parse(text) as { message?: string };
        if (typeof data.message === "string") return data.message;
      } catch {
        /* not JSON */
      }
      return text.slice(0, 200);
    };

    if (isSignup) {
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          setError(await readErrorMessage(response));
        } else {
          await response.json();
          router.push("/dashboard");
        }
      } catch {
        setError("Network error. Check your connection and try again.");
      }
      setIsSubmitting(false);
    } else {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          setError(await readErrorMessage(response));
        } else {
          await response.json();
          router.push("/dashboard");
        }
      } catch {
        setError("Network error. Check your connection and try again.");
      }
      setIsSubmitting(false);
    }
  };
  return (
    <div className="w-full max-w-md animate-page-enter rounded-2xl border border-app-border bg-app-card p-6 shadow-lg transition-all duration-300">
      <h1 className="text-2xl font-semibold text-app-fg">
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-sm text-app-muted">
        {isSignup
          ? "Access the XOrithm service status dashboard."
          : "Sign in to monitor your infrastructure in real time."}
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {isSignup ? (
          <label className="block text-sm text-app-fg">
            Name
            <input
              required
              name="name"
              type="text"
              className="mt-1 w-full rounded-lg border border-app-border bg-app-bg px-3 py-2 text-app-fg outline-none ring-app-accent/30 transition-all duration-200 focus:border-app-accent focus:ring-4"
            />
          </label>
        ) : null}

        <label className="block text-sm text-app-fg">
          Email
          <input
            required
            name="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-app-border bg-app-bg px-3 py-2 text-app-fg outline-none ring-app-accent/30 transition-all duration-200 focus:border-app-accent focus:ring-4"
          />
        </label>

        <label className="block text-sm text-app-fg">
          Password
          <div className="relative mt-1">
            <input
              required
              name="password"
              type={showPassword ? "text" : "password"}
              minLength={8}
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="w-full rounded-lg border border-app-border bg-app-bg py-2 pl-3 pr-14 text-app-fg outline-none ring-app-accent/30 transition-all duration-200 focus:border-app-accent focus:ring-4"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-app-muted transition-colors duration-200 hover:bg-app-card-muted hover:text-app-fg"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        {error ? (
          <p className="rounded-lg border border-app-danger/30 bg-app-danger/10 px-3 py-2 text-sm text-app-danger">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-app-accent px-4 py-2 text-sm font-medium text-[var(--on-accent)] transition-all duration-200 hover:bg-app-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Submitting..."
            : isSignup
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-sm text-app-muted">
        {isSignup ? "Already have an account?" : "No account yet?"}{" "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-medium text-app-accent transition-colors duration-200 hover:text-app-accent-hover"
        >
          {isSignup ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
