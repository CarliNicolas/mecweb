// Temporary admin endpoint to "reset" a product back to the file defaults.
// Removes the product entry from the stored copy so the next read falls back
// to whatever is in src/data/site-content.json for that product id.

import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getStoredSiteContent, saveSiteContent } from "@/lib/site-content-server";

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
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

  const stored = await getStoredSiteContent();
  if (!stored) {
    return NextResponse.json({ success: true, message: "No hay contenido guardado — ya usa los defaults del archivo" });
  }

  const products = Array.isArray(stored.products) ? (stored.products as Record<string, unknown>[]) : [];
  const filtered = products.filter((p) => p?.id !== id);
  const removed = products.length - filtered.length;
  stored.products = filtered;
  await saveSiteContent(stored);

  return NextResponse.json({
    success: true,
    id,
    removed,
    message: removed > 0
      ? `Producto '${id}' eliminado del contenido guardado — ahora usa los defaults del archivo`
      : `Producto '${id}' no estaba en el contenido guardado — nada que hacer`,
  });
}
