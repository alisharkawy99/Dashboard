# XOrithm Service Status Dashboard

A Next.js app for a **service health dashboard**: server status (Up / Degraded / Down), response time, uptime, and region. The dashboard is **protected** — users **sign up**, **log in**, and **log out** with email and password. Server listings are **mock/static** for demos and coursework.

## Live deployment

**Production app (Vercel):** [https://ali-dashboard-xorithm.vercel.app/](https://ali-dashboard-xorithm.vercel.app/)

Sign up or log in there to try the flow; the database on production uses Postgres ([Neon](https://neon.tech)) via the `DATABASE_URL` set in the Vercel project’s environment variables (same kind of connection string you use locally in `.env.local`).

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript  
- **Styling:** Tailwind CSS v4  
- **Auth:** HTTP-only session cookie with a JWT (`jose`), passwords hashed with `bcryptjs`  
- **Users:** [@neondatabase/serverless](https://neon.tech) when `DATABASE_URL` is set; otherwise an in-memory store (local quick tests only — not suitable for serverless production without a real DB)  
- **Hosting:** [Vercel](https://vercel.com)

## Features

- **Authentication:** Sign up, login, logout; middleware protects `/dashboard` and `/servers/*`.  
- **Dashboard:** Server table with status badges; **filter by status** and **sort** (name / response time) via URL query params.  
- **Details:** `/servers/[id]` shows name, IP, response time, uptime, region, and last checked time.

## Prerequisites

- **Node.js** 18.18+ (20+ recommended)  
- **npm** (or pnpm / yarn / bun)

## Run locally

1. **Install** (from this folder — where `package.json` lives):

   ```bash
   npm install
   ```

2. **Environment** — copy the example file and edit `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Set **`AUTH_SECRET`** to a long random string (signs session tokens):

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Database (recommended):** In [Neon](https://neon.tech), create a project and paste the **connection string** into `.env.local` as **`DATABASE_URL`**. The app creates the `users` table when needed. For Vercel, add the same variables under **Settings → Environment Variables** and redeploy.

4. **Dev server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

If Turbopack acts up after big changes, clear `.next` and restart, or run `npm run dev:webpack`.

## Architecture (short)

- **App Router:** `src/app` — route groups `(auth)` for login/signup, `(dashboard)` for protected UI.  
- **Middleware:** `middleware.ts` reads the session from `request.cookies` (`getSessionFromRequest`) and redirects to `/login` when needed.  
- **API:** `POST /api/login`, `POST /api/signup`, `POST /api/logout` set or clear the session cookie.  
- **Data:** `src/lib/servers.ts` — static server list and filter/sort. Users: `src/lib/user.ts` + `src/lib/db.ts` (Postgres when `DATABASE_URL` is set).  
- **URL state:** Dashboard uses `?status=&sort=` so filters survive refresh and can be shared.

## Design notes

- Tailwind, zinc palette, indigo accents.  
- Server Components by default; auth form is a client component.  
- JWT in an **httpOnly** cookie instead of `localStorage` to reduce XSS risk.

## Project layout

```text
src/
  app/           # Routes, layouts, API routes
  Components/    # UI (auth form, table, filters, …)
  lib/           # auth, session, users, server data
middleware.ts    # Protected routes
```

## License

Private / educational use unless you add your own license.
