import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-token";

// Un pedido que cambia datos solo se acepta si viene de este mismo sitio
// (defensa contra CSRF además de la cookie SameSite=Strict).
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (origin) return origin === request.nextUrl.origin;
  return request.headers.get("sec-fetch-site") === "same-origin";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;

  if (pathname.startsWith("/api/admin")) {
    const mutating = !["GET", "HEAD", "OPTIONS"].includes(request.method);
    if (mutating && !isSameOrigin(request)) {
      return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
    }
    // Login, logout y chequeo de sesión manejan su propia autenticación
    if (pathname === "/api/admin/auth") return NextResponse.next();
    if (!(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Páginas del admin (salvo el login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!(await verifyAdminToken(token))) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      if (token) response.cookies.delete(ADMIN_COOKIE);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
