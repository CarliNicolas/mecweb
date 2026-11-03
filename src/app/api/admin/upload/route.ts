import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { writeObject } from "@/lib/storage";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

// Se identifica el formato por sus primeros bytes (no por lo que declara el
// navegador). SVG no se acepta: puede llevar scripts.
function detectImage(bytes: Uint8Array): { ext: string; type: string } | null {
  const b = (i: number) => bytes[i];
  if (b(0) === 0xff && b(1) === 0xd8 && b(2) === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (b(0) === 0x89 && b(1) === 0x50 && b(2) === 0x4e && b(3) === 0x47) return { ext: "png", type: "image/png" };
  if (b(0) === 0x47 && b(1) === 0x49 && b(2) === 0x46 && b(3) === 0x38) return { ext: "gif", type: "image/gif" };
  if (b(0) === 0x52 && b(1) === 0x49 && b(2) === 0x46 && b(3) === 0x46 && b(8) === 0x57 && b(9) === 0x45 && b(10) === 0x42 && b(11) === 0x50)
    return { ext: "webp", type: "image/webp" };
  return null;
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Error al leer el archivo" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "El archivo supera el límite de 8 MB" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const kind = detectImage(new Uint8Array(arrayBuffer.slice(0, 16)));
  if (!kind) return NextResponse.json({ error: "Formato no permitido (usá JPG, PNG, GIF o WebP)" }, { status: 400 });

  const key = `upload-${Date.now()}-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}.${kind.ext}`;

  await writeObject(`images/${key}`, arrayBuffer, kind.type);
  return NextResponse.json({ url: `/api/images/${key}` });
}
