import { findUserByEmail } from "@/src/lib/user";
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { createSessionToken } from "@/src/lib/auth";
import { setSessionCookie } from "@/src/lib/session";
import { firstValidationMessage, loginSchema } from "@/src/lib/validators";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: firstValidationMessage(parsed.error) },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;
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
    await setSessionCookie(sessionToken);
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Login failed. Please try again." },
      { status: 500 },
    );
  }
};
