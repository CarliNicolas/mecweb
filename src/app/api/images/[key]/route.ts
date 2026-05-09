import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  try {
    const store = getStore("images");
    const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
    if (!result?.data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const contentType = (result.metadata?.type as string) || "image/jpeg";
    return new NextResponse(result.data as ArrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
