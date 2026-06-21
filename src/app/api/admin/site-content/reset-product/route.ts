// Temporary admin endpoint to "reset" a product back to the file defaults.
// Removes the product entry from the Blob copy so the next read falls back
// to whatever is in src/data/site-content.json for that product id.

import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN no configurado" }, { status: 500 });
  }

  let id: string | undefined;
  try {
    const body = await request.json();
    id = typeof body?.id === "string" ? body.id : undefined;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ error: "Falta el campo 'id'" }, { status: 400 });
  }

  const { put, list, del } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: "site-content.json" });
  const blob = blobs[0];
  if (!blob) {
    return NextResponse.json({ success: true, message: "No hay Blob — ya usa los defaults del archivo" });
  }

  const res = await fetch(blob.url, {
    headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
  });
  if (!res.ok) {
    return NextResponse.json({ error: "No se pudo leer el Blob actual" }, { status: 500 });
  }
  const blobData = (await res.json()) as Record<string, unknown>;
  const products = Array.isArray(blobData.products) ? (blobData.products as Record<string, unknown>[]) : [];
  const before = products.length;
  const filtered = products.filter((p) => p?.id !== id);
  const removed = before - filtered.length;
  blobData.products = filtered;

  for (const b of blobs) await del(b.url);
  await put("site-content.json", JSON.stringify(blobData), {
    access: "private",
    contentType: "application/json",
  });

  return NextResponse.json({
    success: true,
    id,
    removed,
    message: removed > 0
      ? `Producto '${id}' eliminado del Blob — ahora usa los defaults del archivo`
      : `Producto '${id}' no estaba en el Blob — nada que hacer`,
  });
}
