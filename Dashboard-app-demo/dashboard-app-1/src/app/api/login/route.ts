import { isDatabaseNetworkError } from "@/src/lib/db";
import { findUserByEmail } from "@/src/lib/user";
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/src/lib/auth";
import { cookies } from "next/headers";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
};

export const POST = async (request: Request) => {
    try {
        const { email, password } = await request.json();
        const user = await findUserByEmail(email);
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
        cookieStore.set(SESSION_COOKIE_NAME, sessionToken, cookieOptions);
        return NextResponse.json({ message: "Login successful" }, { status: 200 });
    } catch (e) {
        console.error(e);
        if (isDatabaseNetworkError(e)) {
            return NextResponse.json(
                {
                    message:
                        "Cannot reach the database (network). Confirm DATABASE_URL and, on Windows, try: set NODE_OPTIONS=--dns-result-order=ipv4first before npm run dev.",
                },
                { status: 503 },
            );
        }
        return NextResponse.json(
            { message: "Login failed. Please try again." },
            { status: 500 },
        );
    }
};