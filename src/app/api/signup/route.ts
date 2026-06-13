import { randomUUID } from "crypto";
import { createSessionToken } from "@/src/lib/auth";
import { createUser, findUserByEmail } from "@/src/lib/user";
import { setSessionCookie } from "@/src/lib/session";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { firstValidationMessage, signupSchema } from "@/src/lib/validators";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: firstValidationMessage(parsed.error) },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;
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
      email,
      passwordHash,
    });
    const sessionToken = await createSessionToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
    await setSessionCookie(sessionToken);
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
    return NextResponse.json(
      { message: "Could not create account. Check DATABASE_URL and try again." },
      { status: 500 },
    );
  }
};
