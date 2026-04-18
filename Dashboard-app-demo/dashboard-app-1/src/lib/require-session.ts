import { NextResponse } from "next/server";
import type { SessionPayload } from "@/src/lib/auth";
import { getCurrentSession } from "@/src/lib/session";

/** Any logged-in user (demo: no role checks). */
export const requireSession = async (): Promise<
  | { ok: true; session: SessionPayload }
  | { ok: false; response: NextResponse }
> => {
  const session = await getCurrentSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, session };
};
