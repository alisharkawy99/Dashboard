import { randomUUID } from "crypto";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/src/lib/auth";
import { isDatabaseNetworkError } from "@/src/lib/db";
import { createUser, findUserByEmail } from "@/src/lib/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export const POST = async (request: Request) => {
  try {
    const { name, email, password } = await request.json();
    if (await findUserByEmail(email)) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 },
      );
    }
    const passwordHash = await hash(password, 10);
    const user = await createUser({
      id: randomUUID(),
      name,
      email: email.toLowerCase(),
      passwordHash,
    });
    const sessionToken = await createSessionToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, cookieOptions);
    return NextResponse.json({ message: "User created successfully" }, { status: 200 });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "23505") {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 },
      );
    }
    console.error(e);
    if (isDatabaseNetworkError(e)) {
      return NextResponse.json(
        {
          message:
            "Cannot reach the database (network). Confirm DATABASE_URL in .env.local matches Neon, your network allows HTTPS, and on Windows try: set NODE_OPTIONS=--dns-result-order=ipv4first before npm run dev.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { message: "Could not create account. Check DATABASE_URL and try again." },
      { status: 500 },
    );
  }
};
