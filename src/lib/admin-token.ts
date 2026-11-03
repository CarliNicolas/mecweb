// Firma y verificación del token de sesión del admin (JWT HS256 con jose).
// Sin JWT_SECRET configurado no hay sesiones válidas: falla cerrado.

import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "mecsa_admin_token";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8; // 8 horas

function secretKey(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  return secret && secret.length >= 32 ? new TextEncoder().encode(secret) : null;
}

export async function signAdminToken(username: string): Promise<string> {
  const key = secretKey();
  if (!key) throw new Error("JWT_SECRET no configurado");
  return new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_SECONDS}s`)
    .sign(key);
}

export async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  const key = secretKey();
  if (!token || !key) return false;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}
