'use client';
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
const AuthForm = ({ mode }: { mode: 'login' | 'signup' }) => {
    const isSignup = mode === 'signup'? true : false;
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const formData = new FormData(e.target as HTMLFormElement);
        const payload = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        }
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
        
    }
    return (
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {isSignup
              ? "Access the XOrithm service status dashboard."
              : "Sign in to monitor your infrastructure in real time."}
          </p>
    
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {isSignup ? (
              <label className="block text-sm text-zinc-700">
                Name
                <input
                  required
                  name="name"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-indigo-100 transition focus:ring-4"
                />
              </label>
            ) : null}
    
            <label className="block text-sm text-zinc-700">
              Email
              <input
                required
                name="email"
                type="email"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-indigo-100 transition focus:ring-4"
              />
            </label>
    
            <label className="block text-sm text-zinc-700">
              Password
              <div className="relative mt-1">
                <input
                  required
                  name="password"
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  className="w-full rounded-lg border border-zinc-300 py-2 pl-3 pr-14 outline-none ring-indigo-100 transition focus:ring-4"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>
    
            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
    
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Submitting..."
                : isSignup
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>
    
          <p className="mt-4 text-sm text-zinc-600">
            {isSignup ? "Already have an account?" : "No account yet?"}{" "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isSignup ? "Sign in" : "Create one"}
            </Link>
          </p>
        </div>
      );
}

export default AuthForm