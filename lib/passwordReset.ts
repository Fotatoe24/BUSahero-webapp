import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

const RESET_TOKEN_TTL = "15m";

export async function createResetToken(operatorId: string, email: string) {
  return await new SignJWT({
    sub: operatorId,
    email,
    purpose: "password-reset",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(RESET_TOKEN_TTL)
    .sign(secret);
}

export async function verifyResetToken(token: string) {
  const { payload } = await jwtVerify(token, secret);

  if (payload.purpose !== "password-reset") {
    throw new Error("Invalid token purpose");
  }

  return payload as { sub: string; email: string; purpose: string };
}
