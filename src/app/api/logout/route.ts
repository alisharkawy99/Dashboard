import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/src/lib/session";

export const POST = async () => {
  await clearSessionCookie();
  return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
};
