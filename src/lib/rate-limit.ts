// Límite de pedidos por IP con el binding de Workers Rate Limiting.
// Si el binding no existe (dev sin wrangler) deja pasar: el límite es una
// protección extra, no la autenticación.

import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type LimiterName = "LOGIN_LIMITER" | "CHAT_LIMITER" | "CONTACT_LIMITER";

interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export function clientIp(request: Request): string {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

export async function isRateLimited(name: LimiterName, request: Request): Promise<boolean> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const limiter = (env as unknown as Record<string, RateLimiter | undefined>)[name];
    if (!limiter) return false;
    const { success } = await limiter.limit({ key: clientIp(request) });
    return !success;
  } catch {
    return false;
  }
}

export function tooManyRequests() {
  return Response.json(
    { error: "Demasiados intentos. Esperá un minuto y probá de nuevo." },
    { status: 429, headers: { "Retry-After": "60" } }
  );
}
