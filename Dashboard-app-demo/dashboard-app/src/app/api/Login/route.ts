import { findUserByEmail } from "@/src/lib/user";
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/src/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const { email, password } = await request.json();
    const user = findUserByEmail(email);
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
        return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }
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
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
}