import { jwtVerify, SignJWT } from "jose";
export type SessionPayload = {
    sub: string;
    email: string;
    name: string;
}

const encoder = new TextEncoder();
const secret = encoder.encode(
  process.env.AUTH_SECRET ?? "xorithm-dev-secret-change-me",
);

export const SESSION_COOKIE_NAME = "xorithm_session";
/** Keep in sync with session cookie maxAge in src/lib/session.ts */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function createSessionToken(payload: SessionPayload) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(payload.sub)
      .setIssuedAt()
      .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
      .sign(secret);
  }
  
export async function verifySessionToken(token: string) {
    try {
      const verified = await jwtVerify(token, secret);
      return verified.payload as SessionPayload;
    } catch {
      return null;
    }
  }