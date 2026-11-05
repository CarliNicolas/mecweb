import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, signAdminToken, verifyAdminToken } from "@/lib/admin-token";
import { isRateLimited, tooManyRequests } from "@/lib/rate-limit";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
// Sin ADMIN_PASSWORD configurado el login queda cerrado (no hay clave por defecto).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

// Comparación en tiempo constante (no revela por timing cuántos caracteres coinciden)
function safeEqual(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

export async function POST(request: NextRequest) {
  if (await isRateLimited("LOGIN_LIMITER", request)) return tooManyRequests();
  try {
    const { username, password } = (await request.json()) as { username?: unknown; password?: unknown };

    if (typeof username !== "string" || typeof password !== "string" || !username || !password || password.length > 200) {
      return NextResponse.json(
        { error: "Usuario y contraseña requeridos" },
        { status: 400 }
      );
    }

    if (!ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Acceso al admin no configurado" }, { status: 503 });
    }

    const passwordValid = ADMIN_PASSWORD.startsWith("$2")
      ? await bcrypt.compare(password, ADMIN_PASSWORD)
      : safeEqual(password, ADMIN_PASSWORD);

    if (!safeEqual(username, ADMIN_USERNAME) || !passwordValid) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const token = await signAdminToken(username);

    const response = NextResponse.json({ success: true });

    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ADMIN_SESSION_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  const ok = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
  return NextResponse.json({ authenticated: ok }, { status: ok ? 200 : 401 });
}
