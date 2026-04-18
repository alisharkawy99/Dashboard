import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/src/lib/auth";

const clearCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 0,
};

export const POST = async () => {
  const cookieStore = await cookies();
  // Must match path/options used when setting the cookie, or the browser keeps the session.
  cookieStore.set(SESSION_COOKIE_NAME, "", clearCookie);

  return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
};
