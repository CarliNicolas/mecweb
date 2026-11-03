// Imágenes subidas desde el admin (guardadas en KV).
// Con ?w= (lo pone el loader de next/image) se redimensionan y convierten a
// AVIF/WebP con el binding IMAGES de Cloudflare, y el resultado se guarda en el
// cache del edge: cada variante se transforma una sola vez por datacenter.
// Anchos acotados a una lista fija para no gastar la cuota de transformaciones.

import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readObject } from "@/lib/storage";

const KEY_PATTERN = /^upload-\d+-[a-z0-9]+\.(jpe?g|png|gif|webp)$/i;
const WIDTHS = [256, 384, 640, 828, 1200, 1920];

const CONTENT_TYPE_MAP: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp",
};

// El contenido subido nunca se ejecuta ni se interpreta como otra cosa.
const BASE_HEADERS = {
  "Cache-Control": "public, max-age=31536000, immutable",
  "X-Content-Type-Options": "nosniff",
  "Content-Security-Policy": "default-src 'none'; sandbox",
};

interface ImagesBinding {
  input(stream: ReadableStream<Uint8Array>): {
    transform(t: { width: number; fit: "scale-down" }): {
      output(o: { format: string; quality: number }): Promise<{ image(): ReadableStream<Uint8Array>; contentType(): string }>;
    };
  };
}

function pickWidth(raw: string | null): number | null {
  const n = Number(raw);
  if (!raw || !Number.isFinite(n) || n <= 0) return null;
  return WIDTHS.find((w) => w >= n) ?? WIDTHS[WIDTHS.length - 1];
}

function pickFormat(accept: string): string {
  if (accept.includes("image/avif")) return "image/avif";
  if (accept.includes("image/webp")) return "image/webp";
  return "image/jpeg";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  if (!KEY_PATTERN.test(key)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ext = key.split(".").pop()!.toLowerCase();
  const width = ext === "gif" ? null : pickWidth(request.nextUrl.searchParams.get("w"));
  const format = pickFormat(request.headers.get("accept") || "");

  let cache: Cache | null = null;
  let cacheKey: Request | null = null;
  let waitUntil: ((p: Promise<unknown>) => void) | null = null;
  let images: ImagesBinding | null = null;

  if (width) {
    try {
      const { env, ctx } = await getCloudflareContext({ async: true });
      images = (env as unknown as { IMAGES?: ImagesBinding }).IMAGES ?? null;
      waitUntil = (p) => (ctx as unknown as { waitUntil(p: Promise<unknown>): void }).waitUntil(p);
      cache = (globalThis.caches as unknown as { default: Cache }).default;
      cacheKey = new Request(`https://mecsa-image-cache/${key}?w=${width}&f=${format}`);
      const hit = await cache.match(cacheKey);
      if (hit) return hit;
    } catch {
      images = null;
    }
  }

  const obj = await readObject(`images/${key}`).catch(() => null);
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (width && images) {
    try {
      const result = await images
        .input(new Blob([obj.data]).stream())
        .transform({ width, fit: "scale-down" })
        .output({ format, quality: 78 });
      const response = new Response(result.image(), {
        headers: { ...BASE_HEADERS, "Content-Type": result.contentType(), Vary: "Accept" },
      });
      if (cache && cacheKey && waitUntil) waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch (err) {
      console.error("Image transform failed:", key, err instanceof Error ? err.message : err);
    }
  }

  return new NextResponse(obj.data, {
    headers: { ...BASE_HEADERS, "Content-Type": obj.contentType || CONTENT_TYPE_MAP[ext] || "image/jpeg" },
  });
}
