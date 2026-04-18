import { jwtVerify, SignJWT } from "jose";

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
};

const encoder = new TextEncoder();
const secret = encoder.encode(
  process.env.AUTH_SECRET ?? "xorithm-dev-secret-change-me",
);

export const SESSION_COOKIE_NAME = "xorithm_session";

export const createSessionToken = async (payload: SessionPayload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
};

export const verifySessionToken = async (token: string) => {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as SessionPayload;
  } catch {
    return null;
  }
};
