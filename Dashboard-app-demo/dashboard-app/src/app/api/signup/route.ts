import { createSessionToken, SESSION_COOKIE_NAME } from "@/src/lib/auth";
import { createUser, findUserByEmail } from "@/src/lib/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
    const { name, email, password } = await request.json();
    if (findUserByEmail(email)) {
        return NextResponse.json(
            { message: "An account with this email already exists" },
            { status: 409 },
        );
    }
    const passwordHash = await hash(password, 10);
    const user = createUser({
        id: email,
        name,
        email,
        passwordHash,
    });
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