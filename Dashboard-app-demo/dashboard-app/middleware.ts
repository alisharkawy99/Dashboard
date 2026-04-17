import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "./src/lib/session";

const protectedRoutes = ["/dashboard", "/servers"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (protectedRoutes.some((route) => pathname.startsWith(route))) { 
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}