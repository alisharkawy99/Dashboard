'use client';
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
const AuthForm = ({ mode }: { mode: 'login' | 'signup' }) => {
    const isSignup = mode === 'signup'? true : false;
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        if (isSignup) {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            if (!response.ok) {
                let message = "Request failed";
                const contentType = response.headers.get("content-type") ?? "";
                if (contentType.includes("application/json")) {
                  const errorData = await response.json();
                  message = errorData.message ?? message;
                }
                setError(message);
            } else {
                await response.json();
                router.push('/dashboard');
               
            }
            setIsSubmitting(false);
        }
        else {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            if (!response.ok) {
                let message = "Request failed";
                const contentType = response.headers.get("content-type") ?? "";
                if (contentType.includes("application/json")) {
                  const errorData = await response.json();
                  message = errorData.message ?? message;
                }
                setError(message);
            }
            else {
                await response.json();
                router.push('/dashboard');
                
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
              <input
                required
                name="password"
                type="password"
                minLength={8}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-indigo-100 transition focus:ring-4"
              />
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