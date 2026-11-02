import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "mecsa-dev-secret-change-in-prod"
);
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "mecsa2024";

const COOKIE_NAME = "mecsa_admin_token";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 horas

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña requeridos" },
        { status: 400 }
      );
    }

    if (username !== ADMIN_USERNAME) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    let passwordValid = false;
    if (ADMIN_PASSWORD.startsWith("$2")) {
      passwordValid = await bcrypt.compare(password, ADMIN_PASSWORD);
    } else {
      passwordValid = password === ADMIN_PASSWORD;
    }

    if (!passwordValid) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const token = await new SignJWT({ username, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("mecsa_admin_token");
  return response;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("mecsa_admin_token")?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });
  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
