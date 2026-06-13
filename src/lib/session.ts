import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  verifySessionToken,
} from "@/src/lib/auth";

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};

export const clearSessionCookieOptions = {
  ...sessionCookieOptions,
  maxAge: 0,
};

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", clearSessionCookieOptions);
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}
