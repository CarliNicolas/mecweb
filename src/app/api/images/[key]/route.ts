import { NextRequest, NextResponse } from "next/server";
import { readObject } from "@/lib/storage";

const CONTENT_TYPE_MAP: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  gif: "image/gif", webp: "image/webp", svg: "image/svg+xml",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const ext = key.split(".").pop()?.toLowerCase() || "jpg";

  const obj = await readObject(`images/${key}`).catch(() => null);
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return new NextResponse(obj.data, {
    headers: {
      "Content-Type": obj.contentType || CONTENT_TYPE_MAP[ext] || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
