# XOrithm Service Status Dashboard

A Next.js web app that shows a **service health dashboard** for multiple servers: status (Up / Degraded / Down), response time, uptime, and region. Access to the dashboard is **protected**; users **sign up**, **log in**, and **log out** with email and password. Server data is **mock/static** (in-memory users + static server list), suitable for demos and take-home assignments.

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript  
- **Styling:** Tailwind CSS v4  
- **Auth:** HTTP-only session cookie with a JWT (`jose`), passwords hashed with `bcryptjs`  
- **Hosting:** Designed to deploy on [Vercel](https://vercel.com) (or any Node host)

## Features

- **Authentication:** Sign up, login, logout; session enforced via middleware on `/dashboard` and `/servers/*`.  
- **Dashboard:** Table of servers with color-coded status badges, optional **filter by status** and **sort** (name / response time) via URL search params.  
- **Details:** Click a server row to open `/servers/[id]` with name, IP, response time, uptime, region, and last checked time.

## Prerequisites

- **Node.js** 18.18+ (20+ recommended)  
- **npm** (or pnpm / yarn / bun)

## How to run locally

1. **Install dependencies** (from this folder, where `package.json` lives):

   ```bash
   npm install
   ```

2. **Environment variables** — create `.env.local` in this directory (same level as `package.json`):

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set **`AUTH_SECRET`** to a long random string (used to sign session tokens). Example:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Paste the output as the value of `AUTH_SECRET`.

3. **Start the dev server:**

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

If Turbopack misbehaves after route or config changes, clear `.next` and restart, or use:

```bash
npm run dev:webpack
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



- **App Router:** `src/app` with route groups `(auth)` for login/signup and `(dashboard)` for protected UI.  
- **Middleware:** `middleware.ts` checks the session cookie for protected paths and redirects unauthenticated users to `/login`. Session in middleware is read from `request.cookies` (`getSessionFromRequest`), not `cookies()` from `next/headers`.  
- **API routes:** `POST /api/login`, `POST /api/signup`, `POST /api/logout` set or clear the session cookie.  
- **Data:** `src/lib/servers.ts` holds static server rows; `getServers` applies filter/sort. Users live in `src/lib/user.ts` (in-memory `Map`).  
- **URL state:** Dashboard filters use `?status=&sort=` so views are shareable and refresh-safe.

## Design choices

- **Tailwind** for layout and components; neutral zinc palette with indigo accents for links and primary actions.  
- **Server Components** where possible; forms use client components for submission and navigation.  
- **JWT in httpOnly cookie** reduces XSS risk versus storing tokens in `localStorage`.

## Project layout (short)

```text
src/
  app/                 # Routes, layouts, API handlers
  Components/          # UI (auth form, table, filters, badges, …)
  lib/                 # auth, session, users, server data
middleware.ts          # Route protection
```

## License

Private / educational use unless you add your own license.
