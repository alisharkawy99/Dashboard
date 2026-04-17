import { createSessionToken, SESSION_COOKIE_NAME } from "@/src/lib/auth";
import { createUser } from "@/src/lib/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
    const { name, email, password } = await request.json();
    const user = createUser({ id: email, name, email, passwordHash: password });
    const sessionToken = await createSessionToken({
        sub: user.id,
        email: user.email,
        name: user.name,
    });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
    });
    return NextResponse.json({ message: "User created successfully" }, { status: 200 });
}